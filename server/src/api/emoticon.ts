import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as EmoticonController from '../controller/emoticon';

const router = Router();

router.get('/task/:task_idx', authenticateToken, EmoticonController.getAllEmoticonsByTask);
router.put('/task/:task_idx', authenticateToken, EmoticonController.sendEmoticonToTask);

export default router;
