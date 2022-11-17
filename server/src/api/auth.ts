import express from 'express';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, OAUTH_TYPES, TOKEN_SECRET } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { authenticateToken, generateAccessToken } from '../utils/auth';
import { generateUnionTypeChecker } from '../utils/validate';
import { executeSql } from '../db';
import jwt from 'jsonwebtoken';
import { AuthorizedRequest } from '../types';
import crypto from 'crypto';

const router = express.Router();

const generateSalt = () => {
  return crypto.randomBytes(64).toString('hex');
};

const encrypt = (plain, salt) => {
  return crypto.scryptSync(plain, salt, 64).toString('base64');
};

const httpGetOAuthUserIdentifier = async (oauthType, token) => {
  switch (oauthType) {
    case OAUTH_TYPES.github: {
      const response = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const primaryEmail = response.data[0].email;
      return primaryEmail;
    }
    case OAUTH_TYPES.kakao: {
      const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });
      return data.id;
    }
    default: {
    }
  }
};

const httpGetAccessToken = async (oauthType, code) => {
  const url = OAUTH_TOKEN_REQUEST_URI[oauthType];
  const params = { ...OAUTH_REQUEST_PARAMS[oauthType], code };
  const response = await axios.post(url, null, { params });
  const { access_token } = qs.parse(response.data);
  return access_token;
};

const OAUTH_REDIRECT_URI = {
  [OAUTH_TYPES.github]: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`,
  [OAUTH_TYPES.kakao]: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`,
};
const OAUTH_TOKEN_REQUEST_URI = {
  [OAUTH_TYPES.github]: 'https://github.com/login/oauth/access_token',
  [OAUTH_TYPES.kakao]: 'https://kauth.kakao.com/oauth/token',
};
const OAUTH_REQUEST_PARAMS = {
  [OAUTH_TYPES.github]: {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
  },
  [OAUTH_TYPES.kakao]: {
    grant_type: 'authorization_code',
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
  },
};

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!(userId && password)) return res.sendStatus(400);
  let user;
  [user] = await executeSql('select * from user where user_id = ?', [userId]);
  if (!user) return res.sendStatus(401);

  const encrypted = encrypt(password, user.salt);
  [user] = await executeSql('select * from user where user_id = ? and password = ?', [userId, encrypted]);
  if (!user) return res.sendStatus(401);

  const token = generateAccessToken({ userIdx: user.idx });
  res.cookie('token', token, {
    httpOnly: true,
  });

  res.sendStatus(200);
});

const validateOAuthType = generateUnionTypeChecker(OAUTH_TYPES);

router.get(`/login/:oauth_type`, (req, res) => {
  const oauthType = req.params.oauth_type;
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);
  res.redirect(OAUTH_REDIRECT_URI[oauthType]);
});

router.get('/login/:oauth_type/callback', async (req, res) => {
  const { code } = req.query;
  const oauthType = req.params.oauth_type;
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);

  const accessToken = await httpGetAccessToken(oauthType, code);
  const oauthEmail = await httpGetOAuthUserIdentifier(oauthType, accessToken); // 변수 이름. (카카오에서는 이메일 얻기 위해 검수 필요)

  const [user] = await executeSql('select * from user where oauth_type = ? and oauth_email = ?', [oauthType, oauthEmail]);
  const token = generateAccessToken(user ? { userIdx: user.idx } : { oauthType, oauthEmail });

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

  const salt = generateSalt();
  const encrypted = encrypt(password, salt);
  await (oauthType
    ? executeSql('insert into `user` (user_id, password, username, oauth_type, oauth_email, salt) values (?, ?, ?, ?, ?, ?)', [userId, encrypted, username, oauthType, oauthEmail, salt])
    : executeSql('insert into `user` (user_id, password, username, salt) values (?, ?, ?, ?)', [userId, encrypted, username, salt]));
  console.log(`회원가입 성공: ${userId}, ${username}`);
  res.sendStatus(201);
});

router.get('/check-login', authenticateToken, (req: AuthorizedRequest, res) => {
  res.send(req.user ?? 401);
});

export default router;
