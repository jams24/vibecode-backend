import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

function calculateLevel(totalXp: number): number {
  let level = 1, xpNeeded = 0;
  while (level < 30) {
    xpNeeded += Math.floor(100 * Math.pow(1.12, level - 1));
    if (totalXp < xpNeeded) break;
    level++;
  }
  return level;
}

function getLevelTitle(level: number): string {
  if (level <= 5) return 'Curious Explorer';
  if (level <= 10) return 'Prompt Apprentice';
  if (level <= 15) return 'AI Builder';
  if (level <= 20) return 'Vibe Coder';
  if (level <= 25) return 'Ship Captain';
  return 'Technical Founder';
}

// Submit lesson progress
router.post('/submit', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId, stage, score, perfect } = req.body;
    const userId = req.userId!;

    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, status: 'IN_PROGRESS', stage, score },
      update: { stage, score }
    });

    let xpEarned = 10;
    if (perfect) xpEarned += 25;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    lastActive?.setHours(0, 0, 0, 0);

    let newStreak = user.streak;
    if (!lastActive || lastActive.getTime() < today.getTime()) {
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive && lastActive.getTime() === yesterday.getTime()) newStreak = user.streak + 1;
      else newStreak = 1;
    }
    const streakBonus = Math.min(newStreak * 5, 50);
    xpEarned += streakBonus;

    const newXp = user.xp + xpEarned;
    const newLevel = calculateLevel(newXp);

    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel, weeklyXp: { increment: xpEarned }, streak: newStreak, bestStreak: Math.max(user.bestStreak, newStreak), lastActiveDate: new Date() }
    });

    // If stage 4 (challenge) completed, mark lesson done and unlock next
    let unlockedLesson = null;
    if (stage >= 4) {
      await prisma.userLessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });

      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
      if (lesson) {
        const nextLesson = await prisma.lesson.findFirst({ where: { moduleId: lesson.moduleId, order: lesson.order + 1 } });
        if (nextLesson) {
          await prisma.userLessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId: nextLesson.id } },
            create: { userId, lessonId: nextLesson.id, status: 'AVAILABLE' },
            update: { status: 'AVAILABLE' }
          });
          unlockedLesson = { id: nextLesson.id, title: nextLesson.title, slug: nextLesson.slug };
        } else {
          // Module complete — unlock first lesson of next module
          const nextModule = await prisma.module.findFirst({ where: { order: lesson.module.order + 1 } });
          if (nextModule) {
            const firstLesson = await prisma.lesson.findFirst({ where: { moduleId: nextModule.id }, orderBy: { order: 'asc' } });
            if (firstLesson) {
              await prisma.userLessonProgress.upsert({
                where: { userId_lessonId: { userId, lessonId: firstLesson.id } },
                create: { userId, lessonId: firstLesson.id, status: 'AVAILABLE' },
                update: { status: 'AVAILABLE' }
              });
              unlockedLesson = { id: firstLesson.id, title: firstLesson.title, slug: firstLesson.slug };
            }
          }
        }
      }
    }

    res.json({ xpEarned, streakBonus, totalXp: newXp, level: newLevel, leveledUp: newLevel > user.level, levelTitle: getLevelTitle(newLevel), streak: newStreak, unlockedLesson });
  } catch (error) { console.error('Submit error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Use a heart
router.post('/use-heart', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    const now = new Date();
    const heartsRefilled = Math.floor((now.getTime() - user.heartsUpdatedAt.getTime()) / (30 * 60 * 1000));
    const currentHearts = Math.min(5, user.hearts + heartsRefilled);
    if (currentHearts <= 0) { res.status(400).json({ error: 'No hearts' }); return; }
    await prisma.user.update({ where: { id: req.userId }, data: { hearts: currentHearts - 1, heartsUpdatedAt: now } });
    res.json({ hearts: currentHearts - 1 });
  } catch (error) { console.error('Heart error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Get stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const [user, completed, totalLessons] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userLessonProgress.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.lesson.count()
    ]);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const modules = await prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { lessons: true } }, lessons: { select: { id: true } } }
    });
    const completedIds = new Set((await prisma.userLessonProgress.findMany({ where: { userId, status: 'COMPLETED' }, select: { lessonId: true } })).map(p => p.lessonId));

    const moduleStats = modules.map(m => ({
      name: m.name, slug: m.slug, total: m._count.lessons,
      completed: m.lessons.filter(l => completedIds.has(l.id)).length
    }));

    res.json({
      totalLessons, completedLessons: completed, percentage: Math.round((completed / totalLessons) * 100),
      level: user.level, levelTitle: getLevelTitle(user.level), xp: user.xp,
      streak: user.streak, bestStreak: user.bestStreak, modules: moduleStats
    });
  } catch (error) { console.error('Stats error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
