import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import * as AlarmController from '../controller/alarm';

export const alarmRouter = Router();

alarmRouter.get('/', authenticateToken, AlarmController.getAllAlarms);
