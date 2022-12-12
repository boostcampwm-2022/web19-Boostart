import express from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT, HTTP_PORT, HTTPS_PORT, HOST, API_VERSION, REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD, TOKEN_SECRET } from './src/constants';
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

const corsOptions = {
  origin: CLIENT,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
};

globalSocket.initialize(httpsServer, {
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

const setDiary = async (roomName: string, data: any) => {
  await redisCli.set(roomName, JSON.stringify(data));
};
const getDiary = async (roomName: string) => {
  return JSON.parse(await redisCli.get(roomName));
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (!req.secure) return res.redirect(HOST + req.url);
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
    console.log(`유저 ${socket.uid} 다이어리 ${destId}${date} 입장`);
    console.log(`해당 유저의 소켓 ID는 ${userIdxToSocketId[socket.uid]}(${socket.id}) 입니다.`);
    const roomName = destId + date;
    visitingRoom.set(socket.id, roomName);
    socket.join(roomName);
    if (io.sockets.adapter.rooms.get(roomName).size === 1) {
      const diaryData = (await getDiary(roomName)) || {};
      console.log(roomName, diaryData);
      diaryObjects[roomName] = diaryData;
      io.to(socket.id).emit('initReady');
    } else {
      io.to(socket.id).emit('initReady');
    }
  });
  socket.on('leaveCurrentRoom', async (destId, date) => {
    const roomName = destId + date;
    socket.leave(roomName);
    console.log(io.sockets.adapter.rooms.get(roomName));
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
  socket.on('sendModifiedObject', (objectData) => {
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
    delete connectionIdToUserIdx[(socket.conn as any).id];
    delete userIdxToSocketId[socket.uid];
  });
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`app listening to port ${HTTP_PORT}`);
});
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`app listening to port ${HTTPS_PORT}`);
});
