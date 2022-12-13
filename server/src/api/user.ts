import { Router } from 'express';
import { authenticateToken } from '../utils/auth';
import fileUpload from 'express-fileupload';
import * as UserController from '../controller/user';

const router = Router();
router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get('/', authenticateToken, UserController.findAllUsersByUserId);
router.get('/me', authenticateToken, UserController.getMyInfo);
router.patch('/me', authenticateToken, UserController.updateMyInfo);

export default router;
