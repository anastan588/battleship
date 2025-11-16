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
  shipInfo?: undefined;
  shipsField?: undefined;
  turn?: boolean;
  numberOfSellsWithShips?: number;
  countOfSuccessAttaks?: number;
}

export interface Game {
  idGame: number;
  players: RoomUser[];
  isBot: boolean;
}

export interface Winner {
  name: string;
  wins: number;
}



export type RequestType =
  | 'create_room'
  | 'reg'
  | 'add_user_to_room'
  | 'add_ships'
  | 'attack'
  | 'randomAttack'
  | 'single_play';

export interface BaseRequest {
  type: RequestType;
  data: any; }

export interface CreateRoomRequest extends BaseRequest {
  type: 'create_room';
  data: { roomName: string };
}

export interface RegisterRequest extends BaseRequest {
  type: 'reg';
  data: { name: string; password: string };
}

export interface AddUserToRoomRequest extends BaseRequest {
  type: 'add_user_to_room';
  data: { roomId: number; userId: number };
}

export interface AddShipsRequest extends BaseRequest {
  type: 'add_ships';
  data: { gameId: number; ships: any[] };
}

export interface AttackRequest extends BaseRequest {
  type: 'attack';
  data: { gameId: number; x: number; y: number; indexPlayer: number };
}

export interface RandomAttackRequest extends BaseRequest {
  type: 'randomAttack';
  data: { gameId: number; indexPlayer: number };
}

export interface SinglePlayRequest extends BaseRequest {
  type: 'single_play';
}


export type RequestPayload =
  | CreateRoomRequest
  | RegisterRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest
  | SinglePlayRequest;