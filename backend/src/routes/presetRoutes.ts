import { Router } from 'express';
import { PresetController } from '../controllers/PresetController';

const router = Router();
const presetController = new PresetController();

router.get('/', (req, res, next) => { presetController.getPresets(req, res).catch(next) });
router.post('/', (req, res, next) => { presetController.savePreset(req, res).catch(next) });
router.delete('/:fieldName', (req, res, next) => { presetController.deletePreset(req, res).catch(next) });

export default router;
