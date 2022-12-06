import express from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT, PORT, API_VERSION, REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD } from './src/constants';
import apiRouter from './src/api/index';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import * as redis from 'redis';

const app = express();
const httpServer = http.createServer(app);

const corsOptions = {
  origin: CLIENT,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
};

const io = new Server(httpServer, {
  cors: corsOptions,
});
const redisclient = redis.createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
  legacyMode: true,
});
redisclient.on('connect', () => {
  console.info('redis connected');
});
redisclient.on('error', (err) => {
  console.error('redisError', err);
});
redisclient.connect().then();
const redisCli = redisclient.v4;

const setDiary = async (roomName: string, data: any) => {
  await redisCli.set(roomName, JSON.stringify(data));
};
const getDiary = async (roomName: string) => {
  return JSON.parse(await redisCli.get(roomName));
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(`/api/${API_VERSION}`, apiRouter);
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const diaryObjects = {};
const visitingRoom = new Map();

io.on('connection', (socket) => {
  socket.on('joinToNewRoom', async (destId, date) => {
    const roomName = destId + date;
    visitingRoom.set(socket.id, roomName);
    socket.join(roomName);
    if (io.sockets.adapter.rooms.get(roomName).size === 1) {
      const diaryData = (await getDiary(roomName)) || {};
      diaryObjects[roomName] = diaryData;
    }
  });
  socket.on('leaveCurrentRoom', async (destId, date) => {
    const roomName = destId + date;
    socket.leave(roomName);
    if (!io.sockets.adapter.rooms.get(roomName)) {
      const diaryData = diaryObjects[roomName] || {};
      await setDiary(roomName, diaryData);
    }
  });
  socket.on('requestCurrentObjects', () => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName];
    io.to(socket.id).emit('offerCurrentObjects', targetObjects);
  });
  socket.on('sendModifiedObject', async (objectData) => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName];
    const objectId = objectData.id;
    targetObjects[objectId] = objectData;
    socket.to(roomName).emit('updateModifiedObject', objectData);
  });
  socket.on('sendRemovedObjectId', (objectId) => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName];
    delete targetObjects[objectId];
    socket.to(roomName).emit('applyObjectRemoving', objectId);
  });

  socket.on('disconnect', () => {
    visitingRoom.delete(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
