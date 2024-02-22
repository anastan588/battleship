import { rooms, roomsInGame } from 'dataBase/gameDataBase';
import WebSocketWithId, { Game, Room, RoomUpdateData } from 'types/dataTypes';
import { createGame } from './createGame';

export function addSecondPlayerToRoom(webSocket: WebSocketWithId, roomData) {
  const roomToAddRequest = JSON.parse(roomData.data);
  const findRoomIndex = rooms.findIndex(
    (elem) => elem.roomId === roomToAddRequest.indexRoom
  );
  const roomToAddSecondPlayer = rooms[findRoomIndex];
  if (webSocket.wsUser.index !== rooms[findRoomIndex].roomUsers[0].index) {
    rooms[findRoomIndex].roomUsers.push(webSocket.wsUser);
    roomsInGame.push(roomToAddSecondPlayer);
    const roomIndex = roomsInGame.length - 1;
    if (rooms[findRoomIndex].roomUsers.length === 2) {
      rooms.splice(findRoomIndex, 1);
      createGame(webSocket, roomIndex);
    }
  } else {
    webSocket.send(
      JSON.stringify(`User with such id already exist in this room`)
    );
  }
}
