import express from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT, PORT, API_VERSION } from './src/constants';
import apiRouter from './src/api/index';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const corsOptions = {
  origin: CLIENT,
  credentials: true,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(`/api/${API_VERSION}`, apiRouter);
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const diaryObjects = {};

io.on('connection', (socket) => {
  socket.on('sendShape', (shape) => {
    const objectId = shape.id;
    diaryObjects[objectId] = shape;
    io.emit('dispatchShape', shape);
  });

  socket.on('disconnect', () => {});
});

httpServer.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
