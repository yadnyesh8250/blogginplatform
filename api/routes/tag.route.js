import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createTag, getTags } from '../controllers/tag.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createTag);
router.get('/get', getTags);

export default router;
