import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';

const router = Router();
const controller = new ProfileController();

router.get('/', controller.getProfile.bind(controller));
router.post('/', controller.saveProfile.bind(controller));

export default router;
