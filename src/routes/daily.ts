import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/today', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let daily = await prisma.dailyChallenge.findUnique({ where: { date: today } });

    if (!daily) {
      const challenges = [
        { title: "Landing Page Prompt", prompt: "Write a prompt that creates a modern SaaS landing page with pricing section, testimonials, and a CTA button. Be as specific as possible!", category: "prompt-engineering" },
        { title: "Find the Bug", prompt: "Look at this code: `const apiKey = 'sk-abc123'; fetch('https://api.openai.com', { headers: { Authorization: apiKey } })`. What's wrong and how would you fix it?", category: "security" },
        { title: "API Design", prompt: "Design a prompt for an AI tool to create a REST API for a todo app. Include endpoints, data model, and authentication.", category: "prompt-engineering" },
        { title: "UI Challenge", prompt: "Write a prompt to create a dark-mode dashboard with a sidebar, stats cards, and a chart. Specify colors, fonts, and spacing!", category: "design" },
        { title: "Database Design", prompt: "Write a prompt to create a database schema for a social media app. Include users, posts, comments, and likes. Specify relationships!", category: "prompt-engineering" },
      ];
      const challenge = challenges[Math.floor(Math.random() * challenges.length)];
      daily = await prisma.dailyChallenge.create({ data: { date: today, ...challenge } });
    }

    res.json(daily);
  } catch (error) { console.error('Daily error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
