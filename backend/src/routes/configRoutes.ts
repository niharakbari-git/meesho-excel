import { Router } from 'express';
import { ConfigController } from '../controllers/ConfigController';

const router = Router();
const controller = new ConfigController();

router.post('/', controller.saveConfig.bind(controller));
router.get('/', controller.getConfigs.bind(controller));
router.get('/:name', controller.getConfigByName.bind(controller));

export default router;
