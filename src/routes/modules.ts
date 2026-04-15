import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all modules with lesson counts and progress
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { lessons: true } }, lessons: { select: { id: true }, orderBy: { order: 'asc' } } }
    });

    const progress = await prisma.userLessonProgress.findMany({
      where: { userId: req.userId },
      select: { lessonId: true, status: true }
    });
    const progressMap = new Map(progress.map(p => [p.lessonId, p.status]));

    const result = modules.map(m => {
      const completedCount = m.lessons.filter(l => progressMap.get(l.id) === 'COMPLETED').length;
      const isUnlocked = m.lessons.some(l => { const s = progressMap.get(l.id); return s && s !== 'LOCKED'; }) || m.order === 1;
      return {
        id: m.id, name: m.name, slug: m.slug, description: m.description, icon: m.icon, color: m.color, order: m.order,
        totalLessons: m._count.lessons, completedLessons: completedCount, isUnlocked
      };
    });

    res.json(result);
  } catch (error) { console.error('Modules error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Get lessons for a module
router.get('/:slug', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const mod = await prisma.module.findUnique({
      where: { slug },
      include: { lessons: { orderBy: { order: 'asc' }, select: { id: true, title: true, slug: true, order: true, difficulty: true, estimatedMinutes: true } } }
    });
    if (!mod) { res.status(404).json({ error: 'Module not found' }); return; }

    const progress = await prisma.userLessonProgress.findMany({
      where: { userId: req.userId, lesson: { moduleId: mod.id } },
      select: { lessonId: true, status: true, score: true, stage: true }
    });
    const progressMap = new Map(progress.map(p => [p.lessonId, p]));

    const lessons = mod.lessons.map((l: any) => ({
      ...l,
      status: progressMap.get(l.id)?.status ?? 'LOCKED',
      score: progressMap.get(l.id)?.score ?? 0,
      stage: progressMap.get(l.id)?.stage ?? 0
    }));

    res.json({ ...mod, lessons });
  } catch (error) { console.error('Module detail error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Get a single lesson with full content
router.get('/lesson/:slug', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      include: { module: { select: { name: true, slug: true, color: true, icon: true } } }
    });
    if (!lesson) { res.status(404).json({ error: 'Lesson not found' }); return; }

    const progress = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId: req.userId!, lessonId: lesson.id } }
    });
    if (progress?.status === 'LOCKED') { res.status(403).json({ error: 'Lesson is locked' }); return; }

    const parseJson = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;

    res.json({
      ...lesson,
      concept: parseJson(lesson.concept),
      demo: lesson.demo ? parseJson(lesson.demo) : null,
      quiz: parseJson(lesson.quiz),
      challenge: lesson.challenge ? parseJson(lesson.challenge) : null,
      userProgress: progress ? { status: progress.status, score: progress.score, stage: progress.stage } : null
    });
  } catch (error) { console.error('Lesson error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Search lessons
router.get('/search/:query', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = (req.params.query as string).toLowerCase();
    const lessons = await prisma.lesson.findMany({
      where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { slug: { contains: query, mode: 'insensitive' } }] },
      select: { id: true, title: true, slug: true, difficulty: true, order: true, estimatedMinutes: true, module: { select: { name: true, slug: true, color: true, icon: true } } },
      orderBy: { title: 'asc' }, take: 30
    });
    res.json(lessons);
  } catch (error) { console.error('Search error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
