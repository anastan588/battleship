import WebSocketWithId, { Room, User } from 'types/dataTypes';

export const wsConnections: WebSocketWithId[] = [];

export const players: User[] = [];

export const rooms: Room[] = [];

export const roomsInGame: Room[] = [];

export const games = [];

export const currentPlayersOfGame: User[] = [];

export let roomId = 0;

export let webSocketId = 0;

export function setRoomId(newRoomId) {
  roomId = newRoomId;
  return roomId;
}

export function setWebsoketId(newSocketId) {
  webSocketId = newSocketId;
  return webSocketId;
}