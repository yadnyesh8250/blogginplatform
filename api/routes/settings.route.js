import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/get', getSettings);
router.put('/update', verifyToken, updateSettings);

export default router;
