import express from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, OAUTH_TYPES } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { authenticateToken, generateAccessToken } from '../utils/auth';
import { generateUnionTypeChecker } from '../utils/validate';
import { executeSql } from '../db';

const router = express.Router();

const httpGetUserEmail = async (token) => {
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const primaryEmail = response.data[0].email;
  return primaryEmail;
};

router.get(`/login/github`, (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`);
});

router.get('/login/kakao', (req, res) => {
  res.redirect(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`);
});

router.get(`/login/github/callback/`, async (req, res) => {
  const url = 'https://github.com/login/oauth/access_token';
  const { code } = req.query;

  const response = await axios.post(url, null, {
    params: {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    },
  });

  const { access_token } = qs.parse(response.data);
  const userEmail = await httpGetUserEmail(access_token);

  const token = generateAccessToken({ email: userEmail });

  res.cookie('token', token, {
    httpOnly: true,
  });

  res.redirect(`http://localhost:3000/main`);
});

router.get('/login/kakao/callback', async (req, res) => {
  const url = 'https://kauth.kakao.com/oauth/token';
  const { code } = req.query;

  const response = await axios.post(url, null, {
    params: {
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code,
    },
  });

  const { access_token } = qs.parse(response.data);
  const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  const token = generateAccessToken({ id: data.id });

  res.cookie('token', token, {
    httpOnly: true,
  });

  res.redirect('http://localhost:3000/main');
});

const validateOAuthType = generateUnionTypeChecker(...OAUTH_TYPES);

router.post('/signup', async (req, res) => {
  const { userId, password, username, oauthType, oauthEmail } = req.body;
  const profileImg = 'profile'; // TODO: multer
  // req.file.filename;

  if (!(userId && password && username && profileImg)) return res.sendStatus(400);
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);
  // TODO: 유효성 검증

  if (oauthType) {
    // TODO: 쿠키 뜯어서 토큰 정보와 요청 정보 대조하기

    if (false) return res.sendStatus(401); // 대조 실패한 경우
  }

  const userIdAlreadyExists = await executeSql('select * from where user_id = ?', [userId]);
  if (userIdAlreadyExists) return res.sendStatus(400);
  const userAlreadySignedUp = await executeSql('select * from where oauth_type = ? and oauth_email = ?', [oauthType, oauthEmail]);
  if (userAlreadySignedUp) return res.sendStatus(400);

  await executeSql('insert into user (user_id, password, username, oauth_type, oauth_email) values (?, ?, ?, ?, ?)', [userId, password, username, profileImg, oauthType, oauthEmail]);
  res.sendStatus(200);
});

router.get('/check-login', authenticateToken, (req, res) => {
  res.send(200);
});

export default router;
