import express from 'express';
import { authenticateToken } from '../utils/auth';
import fileUpload from 'express-fileupload';
import * as AuthController from '../controller/auth';

const router = express.Router();
router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.post('/login', AuthController.login);
router.get(`/login/:oauth_type`, AuthController.oauthLogin);
router.get('/login/:oauth_type/callback', AuthController.oauthLoginCallback);
router.post('/signup', AuthController.signup);
router.get('/check-login', authenticateToken, AuthController.checkLogin);
router.get('/logout', authenticateToken, AuthController.logout);

export default router;
