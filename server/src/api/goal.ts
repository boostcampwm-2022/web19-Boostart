import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as GoalController from '../controller/goal';

const router = Router();

router.get('/', authenticateToken, GoalController.getAllGoals);
router.get('/:user_id', authenticateToken, GoalController.getAllFriendsGoals);
router.post('/', authenticateToken, GoalController.createGoal);
router.put('/:goal_idx', authenticateToken, GoalController.updateGoal);
router.delete('/:goal_idx', authenticateToken, GoalController.deleteGoal);

export default router;
