import express from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { authenticateToken, generateAccessToken } from '../utils/auth';

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

router.get('/check-login', authenticateToken, (req, res) => {
  res.send(200);
});

export default router;
