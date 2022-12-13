import { Request, Response } from 'express';
import { CLIENT, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, OAUTH_TYPES, TOKEN_SECRET, DEFAULT_PROFILE } from '../constants';
import axios from 'axios';
import qs from 'qs';
import { authenticateToken, generateAccessToken } from '../utils/auth';
import { generateUnionTypeChecker } from '../utils/validate';
import jwt from 'jsonwebtoken';
import { AuthorizedRequest, SignupRequest } from '../types';
import crypto from 'crypto';
import * as User from '../model/user';

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

export const login = async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  if (!(userId && password)) return res.sendStatus(400);

  const user = await User.getUserByUserId(userId);
  if (!user) return res.status(401).json({ msg: '아이디 또는 비밀번호가 틀렸어요.' });

  const encrypted = encrypt(password, user.salt);
  const userIdx = await User.checkLoginInformation(userId, encrypted);
  if (!userIdx) return res.status(401).json({ msg: '아이디 또는 비밀번호가 틀렸어요.' });

  const token = generateAccessToken({ userIdx });
  res.cookie('token', token, {
    httpOnly: true,
  });
  res.sendStatus(200);
};

const validateOAuthType = generateUnionTypeChecker(OAUTH_TYPES);

export const oauthLogin = (req: Request, res: Response) => {
  const oauthType = req.params.oauth_type;
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);
  res.redirect(OAUTH_REDIRECT_URI[oauthType]);
};

export const oauthLoginCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const oauthType = req.params.oauth_type;
  if (!validateOAuthType(oauthType)) return res.sendStatus(400);

  const accessToken = await httpGetAccessToken(oauthType, code);
  const oauthEmail = await httpGetOAuthUserIdentifier(oauthType, accessToken); // 변수 이름. (카카오에서는 이메일 얻기 위해 검수 필요)

  const userIdx = await User.getIdxByOAuth(oauthType, oauthEmail);
  const token = generateAccessToken(userIdx ? { userIdx } : { oauthType, oauthEmail });

  res.cookie('token', token, {
    httpOnly: true,
  });
  res.redirect(`${CLIENT}/${userIdx ? 'main' : 'signup'}`);
};

export const signup = async (req: SignupRequest, res: Response) => {
  const { userId, password, username } = req.body;

  let profileImgFilename = '';
  if (!req.files) profileImgFilename = DEFAULT_PROFILE;
  else {
    const { profileImg } = req.files;
    profileImgFilename = profileImg.name; // TODO: 해시하기
    profileImg.mv('./uploads/' + profileImgFilename);
  }

  if (!(userId && password && username)) return res.sendStatus(400);
  // TODO: 유효성 검증

  const token = req.cookies.token;

  let oauthType: string = undefined;
  let oauthEmail: string = undefined;
  if (token) {
    ({ oauthType, oauthEmail } = jwt.verify(token, TOKEN_SECRET));
    if (!(oauthType && oauthEmail)) return res.status(401).send({ msg: '잘못된 토큰이에요.' });
    if (!validateOAuthType(oauthType)) return res.status(401).send({ msg: '잘못된 토큰이에요.' });

    const userIdx = await User.getIdxByOAuth(oauthType, oauthEmail);
    if (userIdx) return res.status(409).json({ msg: '해당 이메일은 이미 가입되어 있어요.' });
  }
  console.log('HIHI');
  const userIdx = await User.getIdxByUserId(userId);
  console.log(userIdx);
  if (userIdx) return res.status(409).json({ msg: '이미 존재하는 아이디예요.' });

  const salt = generateSalt();
  const encrypted = encrypt(password, salt);
  await User.createUser(userId, encrypted, username, profileImgFilename, oauthType, oauthEmail, salt);
  res.sendStatus(201);
};

export const checkLogin = (req: AuthorizedRequest, res: Response) => {
  res.send(req.user ?? 401);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.sendStatus(204);
};
