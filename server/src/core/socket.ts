import { Server } from 'socket.io';

class GlobalSocket {
  private _instance;

  constructor() {
    this._instance = new Server();
  }

  get instance() {
    if (!this._instance) {
      throw new Error('socket must be initialized');
    }
    return this._instance;
  }

  initialize(server, corsOptions) {
    this._instance = new Server(server, corsOptions);
  }
}

export const globalSocket = new GlobalSocket();
