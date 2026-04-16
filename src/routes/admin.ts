import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Simple shared-secret auth for admin operations.
// Set ADMIN_SECRET in your ServerMe env vars.
function requireAdmin(req: Request, res: Response): boolean {
  const secret = req.header('x-admin-secret') || req.body?.adminSecret;
  if (!process.env.ADMIN_SECRET) {
    res.status(500).json({ error: 'ADMIN_SECRET not configured on server' });
    return false;
  }
  if (secret !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: 'Invalid admin secret' });
    return false;
  }
  return true;
}

/**
 * POST /api/admin/create-pro-user
 *
 * Creates a user account and immediately grants active Pro subscription
 * status with a far-future expiry. Used for Google Play reviewer accounts
 * and internal QA.
 *
 * Body: { email, username, password, adminSecret }
 * Header alt: x-admin-secret: <secret>
 */
router.post('/create-pro-user', async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({ error: 'email, username, and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'password must be at least 6 characters' });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existing) {
      res.status(409).json({ error: 'Email or username already taken', userId: existing.id });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Year 2099 — effectively lifetime for review purposes
    const farFuture = new Date('2099-12-31T00:00:00.000Z');

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        authProvider: 'email',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: farFuture,
        trialStartDate: null
      }
    });

    // Unlock the first lesson so the reviewer can start immediately
    const firstModule = await prisma.module.findFirst({ orderBy: { order: 'asc' } });
    if (firstModule) {
      const firstLesson = await prisma.lesson.findFirst({
        where: { moduleId: firstModule.id },
        orderBy: { order: 'asc' }
      });
      if (firstLesson) {
        await prisma.userLessonProgress.create({
          data: { userId: user.id, lessonId: firstLesson.id, status: 'AVAILABLE' }
        });
      }
    }

    res.status(201).json({
      message: 'Pro user created',
      userId: user.id,
      email: user.email,
      username: user.username,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      note: 'The user has backend Pro status. If you also want RevenueCat to report this user as Pro, go to the RevenueCat dashboard → Customers → search ' + user.id + ' → Grant promotional entitlement (lifetime).'
    });
  } catch (error: any) {
    console.error('[admin/create-pro-user] error:', error?.message, error?.stack);
    res.status(500).json({ error: 'Internal server error', detail: error?.message });
  }
});

/**
 * POST /api/admin/grant-pro
 *
 * Grants Pro status to an existing user by email or ID.
 * Body: { email OR userId, adminSecret }
 */
router.post('/grant-pro', async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  try {
    const { email, userId } = req.body;
    if (!email && !userId) {
      res.status(400).json({ error: 'email or userId is required' });
      return;
    }

    const where = userId ? { id: userId } : { email };
    const user = await prisma.user.findUnique({ where });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const farFuture = new Date('2099-12-31T00:00:00.000Z');
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: 'active', subscriptionExpiresAt: farFuture }
    });

    res.json({
      message: 'Pro granted',
      userId: updated.id,
      email: updated.email,
      subscriptionStatus: updated.subscriptionStatus,
      subscriptionExpiresAt: updated.subscriptionExpiresAt
    });
  } catch (error: any) {
    console.error('[admin/grant-pro] error:', error?.message, error?.stack);
    res.status(500).json({ error: 'Internal server error', detail: error?.message });
  }
});

export default router;
