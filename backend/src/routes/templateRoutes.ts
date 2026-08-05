import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { TemplateController } from '../controllers/TemplateController';

const router = Router();
const controller = new TemplateController();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads', { recursive: true });
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('template'), controller.uploadTemplate.bind(controller));

export default router;
