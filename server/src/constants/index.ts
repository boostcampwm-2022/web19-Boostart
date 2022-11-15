import dotenv from 'dotenv';

dotenv.config();

export const tokenSecret = process.env.TOKEN_SECRET;
export const port = process.env.PORT;
export const version = process.env.API_VERSION;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY;
export const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
