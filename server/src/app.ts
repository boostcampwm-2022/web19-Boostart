import express from 'express';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN, PORT, API_VERSION } from './constants';
import apiRouter from './api/index';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(`/api/${API_VERSION}`, apiRouter);

app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
