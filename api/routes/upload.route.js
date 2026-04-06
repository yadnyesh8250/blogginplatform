import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/upload.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// store uploads temporarily on disk
const upload = multer({ dest: 'uploads/' });

router.post('/', verifyToken, upload.single('file'), uploadController.uploadImage);
router.get('/', verifyToken, uploadController.getMedia);

export default router;
