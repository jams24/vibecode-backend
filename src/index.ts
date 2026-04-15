import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import moduleRoutes from './routes/modules';
import progressRoutes from './routes/progress';
import leaderboardRoutes from './routes/leaderboard';
import glossaryRoutes from './routes/glossary';
import dailyRoutes from './routes/daily';
import gamificationRoutes from './routes/gamification';
import playgroundRoutes from './routes/playground';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/playground', playgroundRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'VibeCode Academy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`VibeCode Academy API running on port ${PORT}`);
});

export default app;
