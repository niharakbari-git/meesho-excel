import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { TemplateController } from '../controllers/TemplateController';

const router = Router();
const controller = new TemplateController();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('template'), controller.uploadTemplate.bind(controller));

export default router;
