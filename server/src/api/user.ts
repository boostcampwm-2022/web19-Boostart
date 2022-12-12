import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest, UpdateProfileRequest } from '../types';
import { authenticateToken } from '../utils/auth';
import { DEFAULT_PROFILE } from '../constants';
import fileUpload from 'express-fileupload';
import fs from 'fs';

const router = Router();

router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const userId = `%${req.query.user_id}%`;
  try {
    const users = await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user where user_id LIKE ? and idx != ?', [userId, userIdx]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/me', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const [userInfo] = (await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user where idx = ?', [userIdx])) as RowDataPacket[];
    res.json(userInfo);
  } catch {
    res.sendStatus(500);
  }
});

router.patch('/me', authenticateToken, async (req: UpdateProfileRequest, res) => {
  const { userIdx } = req.user;
  const { username } = req.body;

  if (!username) return res.status(400).json({ msg: '올바른 정보를 입력해주세요.' });

  let updateSql = 'update user set username = ?';
  const updateValue = [username];

  if (req.files) {
    const { profile_img: currentProfileImg } = ((await executeSql('select profile_img from user where idx = ?', [userIdx])) as RowDataPacket)[0];
    if (currentProfileImg !== DEFAULT_PROFILE && fs.existsSync(`./uploads/${currentProfileImg}`)) fs.rmSync(`./uploads/${currentProfileImg}`);

    const { profileImg } = req.files;
    const profileImgFilename = profileImg.name; // TODO: 해시하기
    profileImg.mv('./uploads/' + profileImgFilename);

    updateSql += ', profile_img = ?';
    updateValue.push(profileImgFilename);
  }

  updateSql += ' where idx = ?';
  updateValue.push(userIdx);

  try {
    await executeSql(updateSql, updateValue);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
