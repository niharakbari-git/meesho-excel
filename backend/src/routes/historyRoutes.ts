import { Router } from 'express';
import { HistoryController } from '../controllers/HistoryController';

const router = Router();
const historyController = new HistoryController();

router.get('/', (req, res, next) => { historyController.getHistory(req, res).catch(next) });
router.get('/download/:id', (req, res, next) => { historyController.downloadFile(req, res).catch(next) });
router.get('/profile/:id', (req, res, next) => { historyController.getFileProfile(req, res).catch(next) });

export default router;
