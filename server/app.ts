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

io.on('connection', (socket) => {
  socket.on('requestCurrentObjects', () => {
    io.to(socket.id).emit('offerCurrentObjects', diaryObjects);
  });
  socket.on('sendModifiedObject', (objectData) => {
    const objectId = objectData.id;
    diaryObjects[objectId] = objectData;
    socket.broadcast.emit('updateModifiedObject', objectData);
  });
  socket.on('sendRemovedObjectId', (objectId) => {
    delete diaryObjects[objectId];
    socket.broadcast.emit('applyObjectRemoving', objectId);
  });

  socket.on('disconnect', () => {});
});

httpServer.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
