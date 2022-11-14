import dotenv from 'dotenv';

dotenv.config();

export const tokenSecret = process.env.TOKEN_SECRET;
export const port = process.env.PORT;
export const version = process.env.API_VERSION;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
