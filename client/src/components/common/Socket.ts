import { io, Socket } from 'socket.io-client';
import { HOST } from '../../constants/index';

interface ServerToClientEvents {
  dispatchShape: (shape: any) => void;
}

interface ClientToServerEvents {
  sendShape: (shape: any) => void;
}

class GlobalSocket {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(HOST!);
  private static _instance: GlobalSocket;

  static get instance() {
    GlobalSocket._instance ??= new GlobalSocket();
    return GlobalSocket._instance.socket;
  }

  private constructor() {
    this.init();
  }

  init() {
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const globalSocket = GlobalSocket.instance;
export default globalSocket;