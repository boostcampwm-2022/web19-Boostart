import express from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { generateAccessToken } from '../utils/auth';

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

  res.redirect(`http://localhost:8000`);
});

export default router;
