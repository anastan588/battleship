import { currentPlayersOfGame, players } from 'dataBase/gameDataBase';
import WebSocketWithId, { Room } from 'types/dataTypes';

export function addPlayerToNewRoom(webSocket: WebSocketWithId, newRoom: Room) {
  let roomPlayer = {
    name: webSocket.wsUser.name,
    index: webSocket.wsUser.index,
  };
  newRoom.roomUsers.push(roomPlayer);
  return newRoom;
}
