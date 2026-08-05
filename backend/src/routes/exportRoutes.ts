import { Router } from 'express';
import { ExportController } from '../controllers/ExportController';

const router = Router();
const controller = new ExportController();

router.post('/', controller.exportExcel.bind(controller));

export default router;
