import dotenv from 'dotenv';

dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const PORT = process.env.PORT;
export const API_VERSION = process.env.API_VERSION;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY;
export const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
export const CLIENT = process.env.MODE === 'dev' ? process.env.DEV_CLIENT : process.env.PROD_CLIENT;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const OAUTH_TYPES = {
  kakao: 'kakao',
  github: 'github',
} as const;
export const HOST = process.env.MODE === 'dev' ? process.env.DEV_HOST : process.env.PROD_HOST;
export const DEFAULT_PROFILE = 'default_profile.png';
