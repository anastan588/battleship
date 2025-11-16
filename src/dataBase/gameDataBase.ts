import WebSocketWithId, { Game, Room, User, Winner } from 'types/dataTypes';

export const wsConnections: WebSocketWithId[] = [];

export const players: User[] = [];

export const rooms: Room[] = [];

export const roomsInGame: Room[] = [];

export const games = [];

export const currentPlayersOfGame: User[] = [];

export const winners: Winner[] = [];

export let roomId = 0;

export let gameId = 0;

export let playerId = 0;


export let webSocketId = 0;

export const isBot = false;

export function setRoomId(newRoomId: number) {
  roomId = newRoomId;
  return roomId;
}

export function setWebsoketId(newSocketId: number) {
  webSocketId = newSocketId;
  return webSocketId;
}

export function setUserId(newUserId: number) {
  playerId = newUserId;
  return playerId;
}

export function setGameId(newGameId: number) {
  gameId = newGameId;
  return gameId;
}