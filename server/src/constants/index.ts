import dotenv from 'dotenv';

dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const HTTP_PORT = process.env.HTTP_PORT;
export const HTTPS_PORT = process.env.HTTPS_PORT;
export const API_VERSION = process.env.API_VERSION;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY;
export const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
export const MODE = process.env.MODE;
export const CLIENT = MODE === 'dev' ? process.env.DEV_CLIENT : process.env.PROD_CLIENT;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const OAUTH_TYPES = {
  kakao: 'kakao',
  github: 'github',
} as const;
export const HOST = MODE === 'dev' ? process.env.DEV_HOST : process.env.PROD_HOST;
export const DEFAULT_PROFILE = 'default_profile.png';
export const REDIS_USERNAME = process.env.REDIS_USERNAME;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
