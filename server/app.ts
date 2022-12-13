import express from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT, PORT, API_VERSION, REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD, TOKEN_SECRET } from './src/constants';
import apiRouter from './src/api/index';
import cors from 'cors';
import path from 'path';
import { Server, Socket } from 'socket.io';
import http from 'http';
import * as redis from 'redis';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = http.createServer(app);

const connectionIdToUserIdx = {};
const userIdxToSocketId = {};

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

const setDiary = async (roomName: string, data: string): Promise<void> => {
  await redisCli.set(roomName, data);
};
const getDiary = async (roomName: string): Promise<string> => {
  return await redisCli.get(roomName);
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

const updateAuthorList = (roomName: string) => {
  const authorList = diaryObjects[roomName].author;
  const onlineList = diaryObjects[roomName].online;
  io.to(roomName).emit('updateAuthorList', authorList, onlineList);
};

// handshake 과정에서 원시소켓이 가지고 있는 쿠키를 확인
io.engine.on('headers', async (_, request) => {
  const { rawHeaders } = request;
  const connectionId = request._query.sid;

  if (connectionIdToUserIdx[connectionId]) return;
  if (!rawHeaders) return;
  const headerCookieIndex = rawHeaders.indexOf('Cookie');
  if (headerCookieIndex === -1) return;

  const cookies = rawHeaders[headerCookieIndex + 1].split('; ');
  const tokenCookie = cookies.find((cookie) => cookie.substring(0, 6) === 'token=');
  const token = tokenCookie.substring(6);

  jwt.verify(token, TOKEN_SECRET, (error, user) => {
    if (error || !user) return;
    connectionIdToUserIdx[connectionId] = user.userIdx;
  });
});

interface AuthorizedSocket extends Socket {
  uid: string;
}

io.on('connection', (socket: AuthorizedSocket) => {
  // 코드 중복을 줄이기 위해 미들 웨어로 인증 처리
  socket.use((_, next) => {
    const connectionId = (socket.conn as any).id;
    socket.uid = connectionIdToUserIdx[connectionId];
    next();
  });

  // 유저 index로 소켓 ID를 알아낼 수 있게 등록하는 과정. 클라이언트에서 별도로 호출해주어야함
  socket.on('authenticate', () => {
    const connectionId = (socket.conn as any).id;
    const userIdx = connectionIdToUserIdx[connectionId];
    userIdxToSocketId[userIdx] = socket.id;
  });

  socket.on('joinToNewRoom', async (destId, date) => {
    console.log('join');
    const roomName = destId + date;
    visitingRoom.set(socket.id, roomName);
    console.log(visitingRoom);
    socket.join(roomName);
    if (io.sockets.adapter.rooms.get(roomName).size === 1) {
      let diaryData = JSON.parse(await getDiary(roomName)) || { author: [], objects: {} };
      if (diaryData.author === undefined || !isNaN(diaryData.author[0])) diaryData = { author: [], objects: {} };
      diaryData['online'] = [];
      diaryObjects[roomName] = diaryData;
      io.to(socket.id).emit('initReady');
      console.log(diaryObjects);
    } else {
      io.to(socket.id).emit('initReady');
    }
  });

  socket.on('leaveCurrentRoom', async () => {
    console.log('leave');
    console.log(socket.id);
    const roomName = visitingRoom.get(socket.id);
    const userIdx = socket.uid;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
    if (!roomName) return;
    if (authorList.some(({ idx }) => idx === parseInt(userIdx))) {
      diaryObjects[roomName].online = [...onlineList].filter((idx) => idx !== parseInt(userIdx));
      updateAuthorList(roomName);
    }
    socket.leave(roomName);
    if (!io.sockets.adapter.rooms.get(roomName)) {
      const diaryData = diaryObjects[roomName];
      await setDiary(roomName, JSON.stringify(diaryData));
      delete diaryObjects[roomName];
    }
  });

  socket.on('registAuthor', (author) => {
    const roomName = visitingRoom.get(socket.id);
    const userIdx = socket.uid;
    if (!roomName) return;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
    if (!authorList.some(({ idx }) => idx === parseInt(userIdx))) {
      authorList.push(author);
    }
    onlineList.push(parseInt(userIdx));
    updateAuthorList(roomName);
  });

  socket.on('turnToOffline', () => {
    const roomName = visitingRoom.get(socket.id);
    const userIdx = socket.uid;
    const onlineList = diaryObjects[roomName].online;
    diaryObjects[roomName].online = [...onlineList].filter((idx) => idx !== parseInt(userIdx));
    updateAuthorList(roomName);
  });

  socket.on('requestCurrentObjects', () => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName].objects;
    io.to(socket.id).emit('offerCurrentObjects', targetObjects);
    updateAuthorList(roomName);
  });

  socket.on('sendModifiedObject', (objectData) => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName].objects;
    const objectId = objectData.id;
    targetObjects[objectId] = objectData;
    socket.to(roomName).emit('updateModifiedObject', objectData);
  });
  socket.on('sendRemovedObjectId', (objectId) => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName].objects;
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
