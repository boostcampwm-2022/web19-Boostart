import { FabricText, Shape, FabricLine, ObjectData } from 'GlobalType';
import { io, Socket } from 'socket.io-client';
import { HOST } from '../../constants/index';

interface ServerToClientEvents {
  updateModifiedObject: (objectData: FabricLine | FabricText | Shape) => void;
  applyObjectRemoving: (objectId: string) => void;
  offerCurrentObjects: (objectDataMap: ObjectData) => void;
}

interface ClientToServerEvents {
  sendModifiedObject: (objectData: FabricLine | FabricText | Shape) => void;
  sendRemovedObjectId: (objectId: string) => void;
  requestCurrentObjects: () => void;
  joinToNewRoom: (destId: string, date: string) => void;
  leaveCurrentRoom: (destId: string, date: string) => void;
  authenticate: () => void;
}

class GlobalSocket {
  private _instance: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this._instance = io(HOST!);
  }

  get instance() {
    if (!this._instance) {
      throw new Error('socket must be initialized');
    }
    return this._instance;
  }

  initialize() {
    this._instance = io(HOST!);
  }
}

const globalSocket = new GlobalSocket();

export default globalSocket;
