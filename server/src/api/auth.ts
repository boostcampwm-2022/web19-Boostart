import express from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, OAUTH_TYPES, TOKEN_SECRET } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { authenticateToken, generateAccessToken } from '../utils/auth';
import { generateUnionTypeChecker } from '../utils/validate';
import { executeSql } from '../db';
import jwt from 'jsonwebtoken';
import { AuthorizedRequest } from '../types';

const router = express.Router();

const httpGetGithubEmail = async (token) => {
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const primaryEmail = response.data[0].email;
  return primaryEmail;
};

const httpGetKakaoIdx = async (token) => {
  const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  return data.id;
};

const httpGetAccessToken = async (oauthType, code) => {
  const url = OAUTH_TOKEN_REQUEST_URI[oauthType];
  const params = { ...OAUTH_REQUEST_PARAMS[oauthType], code };
  const response = await axios.post(url, null, { params });
  const { access_token } = qs.parse(response.data);
  return access_token;
};

const OAUTH_REDIRECT_URI = {
  github: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`,
  kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`,
};
const OAUTH_TOKEN_REQUEST_URI = {
  github: 'https://github.com/login/oauth/access_token',
  kakao: 'https://kauth.kakao.com/oauth/token',
};
const OAUTH_REQUEST_PARAMS = {
  github: {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
  },
  kakao: {
    grant_type: 'authorization_code',
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
  },
};

const validateOAuthType = generateUnionTypeChecker(...OAUTH_TYPES);

router.get(`/login/:oauth_type`, (req, res) => {
  const oauthType = req.params.oauth_type;
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);
  res.redirect(OAUTH_REDIRECT_URI[oauthType]);
});

router.get('/login/:oauth_type/callback', async (req, res) => {
  const { code } = req.query;
  const oauthType = req.params.oauth_type;

  const accessToken = await httpGetAccessToken(oauthType, code);
  const oauthEmail = await (oauthType === 'github' ? httpGetGithubEmail(accessToken) : httpGetKakaoIdx(accessToken)); // 변수 이름. (카카오에서는 이메일 얻기 위해 검수 필요)

  const [user] = await executeSql('select * from user where oauth_type = ? and oauth_email = ?', [oauthType, oauthEmail]);
  const token = generateAccessToken(user ? { userId: user.user_id } : { oauthType, oauthEmail });

  res.cookie('token', token, {
    httpOnly: true,
  });

  res.redirect(`http://localhost:3000/${user ? 'main' : 'signup'}`);
});

router.post('/signup', async (req, res) => {
  const { userId, password, username } = req.body;
  const profileImg = 'profile'; // TODO: multer
  // req.file.filename;

  if (!(userId && password && username && profileImg)) return res.sendStatus(400);
  // TODO: 유효성 검증

  const token = req.cookies.token;

  let user: object;
  let oauthType: string;
  let oauthEmail: string;
  if (token) {
    ({ oauthType, oauthEmail } = jwt.verify(token, TOKEN_SECRET));
    if (!(oauthType && oauthEmail)) return res.sendStatus(401);
    if (!validateOAuthType(oauthType)) return res.sendStatus(401);

    [user] = await executeSql('select * from user where oauth_type = ? and oauth_email = ?', [oauthType, oauthEmail]);
    if (user) {
      console.log(`이미 가입된 계정: ${oauthType}, ${oauthEmail}`);
      return res.sendStatus(202);
    }
  }

  [user] = await executeSql('select * from user where user_id = ?', [userId]);
  if (user) {
    console.log(`ID 중복: ${userId}`);
    return res.sendStatus(202);
  }

  await (oauthType
    ? executeSql('insert into `user` (user_id, password, username, oauth_type, oauth_email) values (?, ?, ?, ?, ?)', [userId, password, username, oauthType, oauthEmail])
    : executeSql('insert into `user` (user_id, password, username) values (?, ?, ?)', [userId, password, username]));
  console.log(`회원가입 성공: ${userId}, ${username}`);
  res.sendStatus(201);
});

router.get('/check-login', authenticateToken, (req: AuthorizedRequest, res) => {
  res.send(req.user ?? 401);
});

export default router;
