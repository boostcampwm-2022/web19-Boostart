import express from 'express';
import authRouter from './auth';
import taskRouter from './task';
import labelRouter from './label';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);
router.use('/label', labelRouter);

export default router;
