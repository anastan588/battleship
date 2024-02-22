import WebSocketWithId, { Room, User } from 'types/dataTypes';

export const wsConnections: WebSocketWithId[] = [];

export const players: User[] = [];

export const rooms: Room[] = [];

export const roomsInGame: Room[] = [];

export const games = [];

export let currentPlayersOfGame: User[] = [];

export let roomId = 0;

export function setRoomId(newRoomId) {
  roomId = newRoomId;
  return roomId;
}
