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
import { executeSql } from './src/db';
import { AlarmType } from './src/api/emoticon';

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

// handshake ???????????? ??????????????? ????????? ?????? ????????? ??????
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
  // ?????? ????????? ????????? ?????? ?????? ????????? ?????? ??????
  socket.use((_, next) => {
    const connectionId = (socket.conn as any).id;
    socket.uid = connectionIdToUserIdx[connectionId];
    next();
  });

  // ?????? index??? ?????? ID??? ????????? ??? ?????? ???????????? ??????. ????????????????????? ????????? ?????????????????????
  socket.on('authenticate', () => {
    const connectionId = (socket.conn as any).id;
    const userIdx = connectionIdToUserIdx[connectionId];
    userIdxToSocketId[userIdx] = socket.id;

    // ?????????????????? ?????? ?????? ???????????? ?????????????????????.
    // console.log(`?????? ${userIdx} ?????????`);
    // console.log(`-- ????????? ???????????? ?????? ?????? ?????? --`);
    // console.log(io.sockets.sockets.keys());
    // console.log(`-- ???????????? ????????? ?????? ????????? ?????? --`);
    // console.log(userIdxToSocketId);
    // console.log(`-- ???????????? ?????? ???????????? ?????? ?????? ????????? ?????? --`);
    // console.log(connectionIdToUserIdx);
  });

  socket.on('joinToNewRoom', async (destId, date) => {
    const roomName = destId + date;
    visitingRoom.set(socket.id, roomName);
    socket.join(roomName);
    if (io.sockets.adapter.rooms.get(roomName).size === 1) {
      let diaryData = JSON.parse(await getDiary(roomName)) || { author: [], objects: {} };
      if (diaryData.author === undefined || !isNaN(diaryData.author[0])) diaryData = { author: [], objects: {} };
      diaryData['online'] = [];
      diaryObjects[roomName] = diaryData;
      io.to(socket.id).emit('initReady');
    } else {
      io.to(socket.id).emit('initReady');
    }
  });

  socket.on('leaveCurrentRoom', async () => {
    const roomName = visitingRoom.get(socket.id);
    if (!roomName || !diaryObjects[roomName]) return;
    const userIdx = socket.uid;
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

  socket.on('registAuthor', async (author) => {
    const roomName = visitingRoom.get(socket.id);
    const userIdx = socket.uid;
    if (!roomName || !diaryObjects[roomName]) return;
    const authorList = diaryObjects[roomName].author;
    const onlineList = diaryObjects[roomName].online;
    if (!authorList.some(({ idx }) => idx === parseInt(userIdx))) {
      authorList.push(author);
    }
    onlineList.push(parseInt(userIdx));
    updateAuthorList(roomName);

    // if (?????? ??????) return;
    const DATE_FORMAT_LENGTH = 10;
    const receiverId = roomName.substring(0, roomName.length - DATE_FORMAT_LENGTH);
    console.log(receiverId);
    const date = roomName.substring(roomName.length - DATE_FORMAT_LENGTH);
    const { receiverIdx } = (await executeSql('select idx as receiverIdx from user where user_id = ?', [receiverId]))[0];
    const redirectURI = '#';
    await executeSql(`insert into alarm (publisher_idx, receiver_idx, type, content, redirect, status) values (?, ?, '${AlarmType.DIARY_EDIT}', ?, '${redirectURI}', false)`, [userIdx, receiverIdx, date]);
  });

  socket.on('turnToOffline', () => {
    const roomName = visitingRoom.get(socket.id);
    if (!roomName || !diaryObjects[roomName]) return;
    const userIdx = socket.uid;
    const onlineList = diaryObjects[roomName].online;
    diaryObjects[roomName].online = [...onlineList].filter((idx) => idx !== parseInt(userIdx));
    updateAuthorList(roomName);
  });

  socket.on('requestCurrentObjects', () => {
    const roomName = visitingRoom.get(socket.id);
    if (!roomName || !diaryObjects[roomName]) return;
    const targetObjects = diaryObjects[roomName].objects;
    io.to(socket.id).emit('offerCurrentObjects', targetObjects);
    updateAuthorList(roomName);
  });

  socket.on('sendModifiedObject', (objectData) => {
    const roomName = visitingRoom.get(socket.id);
    if (!roomName || !diaryObjects[roomName]) return;
    const targetObjects = diaryObjects[roomName].objects;
    const objectId = objectData.id;
    targetObjects[objectId] = objectData;
    io.to(roomName).emit('updateModifiedObject', objectData);
  });
  socket.on('sendRemovedObjectId', (objectId) => {
    const roomName = visitingRoom.get(socket.id);
    const targetObjects = diaryObjects[roomName].objects;
    delete targetObjects[objectId];
    socket.to(roomName).emit('applyObjectRemoving', objectId);
  });

  socket.on('disconnect', async () => {
    const roomName = visitingRoom.get(socket.id);
    if (!roomName || !diaryObjects[roomName]) return;
    const userIdx = socket.uid;
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
