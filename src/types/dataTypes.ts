import { WebSocket } from 'ws';

export default interface WebSocketWithId extends WebSocket {
  id: number;
  wsUser?: User;
}

export interface User {
  index: number;
  name: string;
  password: string;
}

export interface ResponseRegistration {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface Room {
  roomId: number;
  roomUsers: RoomUser[];
  password?: number;
}

export interface RoomUpdateData {
  indexRoom: number;
}

export interface RoomUser {
  name: string;
  index: number;
}

export interface Game {
  idGame: number;
  players: RoomUser[];
}
