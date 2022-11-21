import express from 'express';
import authRouter from './auth';
import taskRouter from './task';
import tagRouter from './tag';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);
router.use('/tag', tagRouter);

export default router;
