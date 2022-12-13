import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as TagController from '../controller/tag';

const router = Router();

router.get('/', authenticateToken, TagController.getAllTags);
router.get('/:user_id', authenticateToken, TagController.getAllFriendsTags);
router.post('/', authenticateToken, TagController.createTag);
router.post('/color/:tag_idx', authenticateToken, TagController.updateTagColor);
router.delete('/:tag_idx', authenticateToken, TagController.deleteTag);

export default router;
