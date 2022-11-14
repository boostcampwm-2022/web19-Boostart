import express from 'express';
import cookieParser from 'cookie-parser';
import { port, version } from './constants';
import { authenticateToken } from './utils/auth';
import apiRouter from './api/index';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(`/api/${version}`, apiRouter);

app.get('/', authenticateToken, (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`app listening to port ${port}`);
});
