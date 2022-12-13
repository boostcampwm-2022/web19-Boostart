import express from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT, HTTP_PORT, HTTPS_PORT, HOST, API_VERSION, REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD, TOKEN_SECRET, MODE } from './src/constants';
import apiRouter from './src/api/index';
import cors from 'cors';
import path from 'path';
import { Socket } from 'socket.io';
import http from 'http';
import https from 'https';
import fs from 'fs';
import * as redis from 'redis';
import jwt from 'jsonwebtoken';
import { connectionIdToUserIdx, userIdxToSocketId } from './src/core/store';
import { globalSocket } from './src/core/socket';

const options = {
  cert: fs.readFileSync('../rootca.pem'),
  key: fs.readFileSync('../rootca-key.pem'),
};

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

const server = MODE === 'dev' ? httpServer : httpsServer;

const corsOptions = {
  origin: CLIENT,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
};

globalSocket.initialize(server, {
  cors: corsOptions,
});

const io = globalSocket.instance;

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
app.use((req, res, next) => {
  if (MODE !== 'dev' && !req.secure) return res.redirect(HOST + req.url);
  next();
});
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

    // 테스트하시기 쉽게 우선 주석으로 남겨두겠습니다.
    // console.log(`유저 ${userIdx} 로그인`);
    // console.log(`-- 서버와 연결되어 있는 소켓 목록 --`);
    // console.log(io.sockets.sockets.keys());
    // console.log(`-- 접속중인 유저의 소켓 아이디 목록 --`);
    // console.log(userIdxToSocketId);
    // console.log(`-- 연결중인 소켓 커넥션에 대한 유저 아이디 목록 --`);
    // console.log(connectionIdToUserIdx);
  });

  socket.on('joinToNewRoom', async (destId, date) => {
    const userIdx = socket.uid;
    const roomName = destId + date;
    visitingRoom.set(userIdx, roomName);
    socket.join(roomName);
    if (io.sockets.adapter.rooms.get(roomName).size === 1) {
      let diaryData = JSON.parse(await getDiary(roomName)) || { author: [], objects: {} };
      if (diaryData.author === undefined || !isNaN(diaryData.author[0])) diaryData = { author: [], objects: {} };
      diaryData['online'] = [];
      diaryObjects[roomName] = diaryData;
    }

    const targetObjects = diaryObjects[roomName].objects;
    socket.emit('offerCurrentObjects', targetObjects);
    updateAuthorList(roomName);
  });

  socket.on('leaveCurrentRoom', async () => {
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    if (!roomName || !diaryObjects[roomName]) return;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
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
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    if (!roomName || !diaryObjects[roomName]) return;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
    if (!authorList.some(({ idx }) => idx === parseInt(userIdx))) {
      authorList.push(author);
    }
    onlineList.push(parseInt(userIdx));
    updateAuthorList(roomName);
  });

  socket.on('turnToOffline', () => {
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    if (!roomName || !diaryObjects[roomName]) return;
    const onlineList = diaryObjects[roomName].online;
    diaryObjects[roomName].online = [...onlineList].filter((idx) => idx !== parseInt(userIdx));
    updateAuthorList(roomName);
  });

  socket.on('sendModifiedObject', (objectData) => {
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    if (!roomName || !diaryObjects[roomName]) return;
    const targetObjects = diaryObjects[roomName].objects;
    const objectId = objectData.id;
    targetObjects[objectId] = objectData;
    io.to(roomName).emit('updateModifiedObject', objectData);
  });
  socket.on('sendRemovedObjectId', (objectId) => {
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    const targetObjects = diaryObjects[roomName].objects;
    delete targetObjects[objectId];
    socket.to(roomName).emit('applyObjectRemoving', objectId);
  });

  socket.on('disconnect', async () => {
    const userIdx = socket.uid;
    const roomName = visitingRoom.get(userIdx);
    if (!roomName || !diaryObjects[roomName]) return;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
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
    visitingRoom.delete(userIdx);
    delete connectionIdToUserIdx[(socket.conn as any).id];
    delete userIdxToSocketId[userIdx];
  });
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`app listening to port ${HTTP_PORT}`);
});
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`app listening to port ${HTTPS_PORT}`);
});
