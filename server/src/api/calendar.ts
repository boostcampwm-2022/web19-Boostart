import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as CalendarController from '../controller/calendar';

const router = Router();

router.get('/task', authenticateToken, CalendarController.getTaskExistenceList);
router.get('/task/:user_id', authenticateToken, CalendarController.getFriendsTaskExistenceList);
router.get('/goal', authenticateToken, CalendarController.getAverageGoalAchievementRateList);
router.get('/goal/:user_id', authenticateToken, CalendarController.getFriendsAverageGoalAchievementRateList);

export default router;
