import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

// 🔥 ONLY ADMIN CAN ACCESS
router.get('/', verifyToken, getDashboard);

export default router;