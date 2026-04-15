import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/badges', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany(),
      prisma.userBadge.findMany({ where: { userId: req.userId }, select: { badgeId: true, unlockedAt: true } })
    ]);
    const unlockedMap = new Map(userBadges.map(b => [b.badgeId, b.unlockedAt]));
    res.json(allBadges.map(b => ({ ...b, criteria: typeof b.criteria === 'string' ? JSON.parse(b.criteria as string) : b.criteria, unlocked: unlockedMap.has(b.id), unlockedAt: unlockedMap.get(b.id) ?? null })));
  } catch (error) { console.error('Badges error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

router.patch('/settings', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dailyGoal, skillLevel } = req.body;
    const data: Record<string, unknown> = {};
    if (dailyGoal && [1, 3, 5].includes(dailyGoal)) data.dailyGoal = dailyGoal;
    if (skillLevel && ['beginner', 'intermediate', 'advanced'].includes(skillLevel)) data.skillLevel = skillLevel;
    const user = await prisma.user.update({ where: { id: req.userId }, data, select: { dailyGoal: true, skillLevel: true } });
    res.json(user);
  } catch (error) { console.error('Settings error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
