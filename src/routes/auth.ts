import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '90d' });
  return { accessToken, refreshToken };
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) { res.status(400).json({ error: 'All fields required' }); return; }
    if (password.length < 6) { res.status(400).json({ error: 'Password must be 6+ characters' }); return; }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) { res.status(409).json({ error: 'Email or username already taken' }); return; }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, username, passwordHash } });

    // Unlock first lesson
    const firstModule = await prisma.module.findFirst({ orderBy: { order: 'asc' } });
    if (firstModule) {
      const firstLesson = await prisma.lesson.findFirst({ where: { moduleId: firstModule.id }, orderBy: { order: 'asc' } });
      if (firstLesson) {
        await prisma.userLessonProgress.create({ data: { userId: user.id, lessonId: firstLesson.id, status: 'AVAILABLE' } });
      }
    }

    const tokens = generateTokens(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp }, ...tokens });
  } catch (error) { console.error('Register error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Google Sign-In
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) { res.status(400).json({ error: 'ID token required' }); return; }

    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!googleRes.ok) { res.status(401).json({ error: 'Invalid Google token' }); return; }
    const googleUser = await googleRes.json() as { sub: string; email: string; name: string; picture: string };
    if (!googleUser.email) { res.status(400).json({ error: 'No email in Google token' }); return; }

    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (user) {
      if (!user.googleId) await prisma.user.update({ where: { id: user.id }, data: { googleId: googleUser.sub, authProvider: 'google', avatarUrl: googleUser.picture } });
    } else {
      const baseName = googleUser.name?.replace(/\s+/g, '').toLowerCase().slice(0, 20) || `user${Date.now()}`;
      const username = await prisma.user.findUnique({ where: { username: baseName } }) ? `${baseName}${Math.floor(Math.random() * 999)}` : baseName;
      user = await prisma.user.create({ data: { email: googleUser.email, username, authProvider: 'google', googleId: googleUser.sub, avatarUrl: googleUser.picture, trialStartDate: new Date() } });

      const firstModule = await prisma.module.findFirst({ orderBy: { order: 'asc' } });
      if (firstModule) {
        const firstLesson = await prisma.lesson.findFirst({ where: { moduleId: firstModule.id }, orderBy: { order: 'asc' } });
        if (firstLesson) await prisma.userLessonProgress.create({ data: { userId: user.id, lessonId: firstLesson.id, status: 'AVAILABLE' } });
      }
    }

    const tokens = generateTokens(user.id);
    res.json({ user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp, hearts: user.hearts, streak: user.streak, league: user.league, avatarUrl: user.avatarUrl, skillLevel: user.skillLevel }, ...tokens });
  } catch (error) { console.error('Google auth error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    if (!user.passwordHash) { res.status(401).json({ error: 'This account uses Google Sign-In' }); return; }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }

    const tokens = generateTokens(user.id);
    res.json({
      user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp, hearts: user.hearts, streak: user.streak, league: user.league, skillLevel: user.skillLevel },
      ...tokens
    });
  } catch (error) { console.error('Login error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) { res.status(400).json({ error: 'Refresh token required' }); return; }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    res.json(generateTokens(payload.userId));
  } catch { res.status(401).json({ error: 'Invalid refresh token' }); }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, username: true, xp: true, level: true, hearts: true, heartsUpdatedAt: true, streak: true, bestStreak: true, lastActiveDate: true, streakFreezes: true, league: true, weeklyXp: true, dailyGoal: true, skillLevel: true, createdAt: true, authProvider: true, googleId: true, avatarUrl: true, experienceLevel: true, buildGoals: true, trialStartDate: true, subscriptionStatus: true, subscriptionExpiresAt: true }
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const now = new Date();
    const msSinceUpdate = now.getTime() - user.heartsUpdatedAt.getTime();
    const heartsToAdd = Math.floor(msSinceUpdate / (30 * 60 * 1000));
    const currentHearts = Math.min(5, user.hearts + heartsToAdd);

    const trialStart = user.trialStartDate ? new Date(user.trialStartDate) : null;
    const trialDaysUsed = trialStart ? Math.floor((now.getTime() - trialStart.getTime()) / (24*60*60*1000)) : 0;
    const trialDaysRemaining = Math.max(0, 7 - trialDaysUsed);
    const isTrialActive = user.subscriptionStatus === 'trial' && trialDaysRemaining > 0;
    const isPro = user.subscriptionStatus === 'active' || isTrialActive;

    res.json({ ...user, hearts: currentHearts, isTrialActive, trialDaysRemaining, isPro });
  } catch (error) { console.error('Profile error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
