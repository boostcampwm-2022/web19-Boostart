import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = `%${req.query.user_id}%`;
  const users = await executeSql('select idx, user_id, username, profile_img from user where user_id LIKE ?', [userId]);
  res.json(users);
});

export default router;
