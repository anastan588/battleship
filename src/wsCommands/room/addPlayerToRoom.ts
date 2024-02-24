
import WebSocketWithId, { Room } from 'types/dataTypes';

export function addPlayerToNewRoom(webSocket: WebSocketWithId, newRoom: Room) {
  const roomPlayer = {
    name: webSocket.wsUser.name,
    index: webSocket.wsUser.index,
  };
  newRoom.roomUsers.push(roomPlayer);
  return newRoom;
}
