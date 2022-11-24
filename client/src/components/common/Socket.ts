import { FabricText, Shape, FabricLine } from 'GlobalType';
import { io, Socket } from 'socket.io-client';
import { HOST } from '../../constants/index';

interface ServerToClientEvents {
  dispatchCreatedShape: (shape: Shape, senderId: string) => void;
  dispatchCreatedText: (textData: FabricText, senderId: string) => void;
  dispatchCreatedLine: (lineData: FabricLine, senderId: string) => void;
}

interface ClientToServerEvents {
  sendCreatedShape: (shape: Shape, senderId: string) => void;
  sendCreatedText: (textData: FabricText, senderId: string) => void;
  sendCreatedLine: (lineData: FabricLine, senderId: string) => void;
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
