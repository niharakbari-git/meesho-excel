import { Router } from 'express';
import { GeneratorController } from '../controllers/GeneratorController';

const router = Router();
const controller = new GeneratorController();

router.post('/', controller.generate.bind(controller));

export default router;
