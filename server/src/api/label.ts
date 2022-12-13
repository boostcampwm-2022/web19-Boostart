import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as LabelController from '../controller/label';

const router = Router();

router.get('/', authenticateToken, LabelController.getAllLabels);
router.get('/:user_id', authenticateToken, LabelController.getAllFriendsLabels);
router.post('/', authenticateToken, LabelController.createLabel);
router.patch('/:label_idx', authenticateToken, LabelController.updateLabel);
router.delete('/:label_idx', authenticateToken, LabelController.deleteLabel);

export default router;
