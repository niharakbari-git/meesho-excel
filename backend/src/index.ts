import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDb } from './database/db';
import profileRoutes from './routes/profileRoutes';
import templateRoutes from './routes/templateRoutes';
import generatorRoutes from './routes/generatorRoutes';
import exportRoutes from './routes/exportRoutes';
import configRoutes from './routes/configRoutes';
import historyRoutes from './routes/historyRoutes';
import presetRoutes from './routes/presetRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

app.use('/api/profile', profileRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/generator', generatorRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/presets', presetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler for production hardening
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error]', err.stack || err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500 
    ? 'Internal Server Error' 
    : err.message || 'Something went wrong';
  res.status(status).json({ success: false, message });
});

async function startServer() {
  try {
    await initializeDb();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
