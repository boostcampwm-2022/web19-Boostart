import { FabricText, Shape, FabricLine, ObjectData, Friend } from 'GlobalType';
import { io, Socket } from 'socket.io-client';
import { HOST } from '../../constants/index';

interface ServerToClientEvents {
  updateModifiedObject: (objectData: FabricLine | FabricText | Shape) => void;
  applyObjectRemoving: (objectId: string) => void;
  offerCurrentObjects: (objectDataMap: ObjectData) => void;
  initReady: () => void;
  updateAuthorList: (authorList: Friend[], onlineList: number[]) => void;
}

interface ClientToServerEvents {
  sendModifiedObject: (objectData: FabricLine | FabricText | Shape) => void;
  sendRemovedObjectId: (objectId: string) => void;
  requestCurrentObjects: () => void;
  joinToNewRoom: (destId: string, date: string) => void;
  leaveCurrentRoom: () => void;
  authenticate: () => void;
  registAuthor: (myProfile: Friend) => void;
  turnToOffline: () => void;
}

class GlobalSocket {
  private _instance: Socket<any>;

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
    this._instance.disconnect();
    this._instance = io(HOST!);
  }
}

const globalSocket = new GlobalSocket();

export default globalSocket;
