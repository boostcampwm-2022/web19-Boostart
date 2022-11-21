import express from 'express';
import authRouter from './auth';
import taskRouter from './task';
import labelRouter from './label';
import tagRouter from './tag';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);
router.use('/label', labelRouter);
router.use('/tag', tagRouter);

export default router;
