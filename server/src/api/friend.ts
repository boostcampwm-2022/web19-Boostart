import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as FriendController from '../controller/friend';

const router = Router();

router.get('/', authenticateToken, FriendController.getAllFriends);
router.get('/request', authenticateToken, FriendController.getAllFriendRequests);
router.delete('/:user_idx', authenticateToken, FriendController.deleteFriend);
router.put('/request/:user_idx', authenticateToken, FriendController.sendFriendRequest);
router.patch('/accept/:user_idx', authenticateToken, FriendController.acceptFriendRequest);
router.delete('/accept/:user_idx', authenticateToken, FriendController.refuseFriendRequest);

export default router;
