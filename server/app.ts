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

const corsOptions = {
  origin: CLIENT,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

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
  socket.on('joinToNewRoom', (destId, date) => {
    const roomName = destId + date;
    socket.join(roomName);
    visitingRoom.set(socket.id, roomName);
  });
  socket.on('leaveCurrentRoom', (destId, date) => {
    const roomName = destId + date;
    socket.leave(roomName);
    visitingRoom.delete(socket.id);
  });
  socket.on('requestCurrentObjects', () => {
    console.log('requested');
    const roomName = visitingRoom.get(socket.id);
    if (!diaryObjects[roomName]) diaryObjects[roomName] = {};
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
  });
});

httpServer.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
