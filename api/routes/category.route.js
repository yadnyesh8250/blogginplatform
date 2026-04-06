import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createCategory, getCategories } from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createCategory);
router.get('/get', getCategories);

export default router;
