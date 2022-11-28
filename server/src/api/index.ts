import express from 'express';
import authRouter from './auth';
import taskRouter from './task';
import labelRouter from './label';
import tagRouter from './tag';
import userRouter from './user';
import friendRouter from './friend';
import emoticonRouter from './emoticon';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/task', taskRouter);
router.use('/label', labelRouter);
router.use('/tag', tagRouter);
router.use('/user', userRouter);
router.use('/friend', friendRouter);
router.use('/emoticon', emoticonRouter);

export default router;
