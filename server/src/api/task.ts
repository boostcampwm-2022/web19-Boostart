import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as TaskController from '../controller/task';

const router = Router();

router.get('/', authenticateToken, TaskController.getAllTasks);
router.get('/:user_id', authenticateToken, TaskController.getAllFriendsTasks);
router.post('/', authenticateToken, TaskController.createTask);
router.patch('/update/:task_idx', authenticateToken, TaskController.updateTask);
router.patch('/status/:task_idx', authenticateToken, TaskController.updateTaskStatus);
router.delete('/:task_idx', authenticateToken, TaskController.deleteTask);

export default router;
