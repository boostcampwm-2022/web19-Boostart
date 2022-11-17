import express from 'express';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN, PORT, API_VERSION } from './src/constants';
import apiRouter from './src/api/index';
import cors from 'cors';
import path from 'path';

const app = express();

const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(`/api/${API_VERSION}`, apiRouter);
app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
