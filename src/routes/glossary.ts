import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all glossary terms
router.get('/', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const terms = await prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
    res.json(terms.map(t => ({ ...t, relatedTerms: typeof t.relatedTerms === 'string' ? JSON.parse(t.relatedTerms as string) : t.relatedTerms })));
  } catch (error) { console.error('Glossary error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Search glossary
router.get('/search/:query', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.params.query as string;
    const terms = await prisma.glossaryTerm.findMany({
      where: { OR: [{ term: { contains: query, mode: 'insensitive' } }, { definition: { contains: query, mode: 'insensitive' } }] },
      orderBy: { term: 'asc' }, take: 20
    });
    res.json(terms.map(t => ({ ...t, relatedTerms: typeof t.relatedTerms === 'string' ? JSON.parse(t.relatedTerms as string) : t.relatedTerms })));
  } catch (error) { console.error('Glossary search error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Get term by slug
router.get('/:term', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const term = await prisma.glossaryTerm.findUnique({ where: { term: req.params.term as string } });
    if (!term) { res.status(404).json({ error: 'Term not found' }); return; }
    res.json({ ...term, relatedTerms: typeof term.relatedTerms === 'string' ? JSON.parse(term.relatedTerms as string) : term.relatedTerms });
  } catch (error) { console.error('Glossary term error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
