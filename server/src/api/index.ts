import express from 'express';
import authRouter from './auth';
import taskRouter from './task';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);

export default router;
