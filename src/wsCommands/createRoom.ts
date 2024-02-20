import { rooms } from 'dataBase/gameDataBase';
import { Room } from 'types/dataTypes';

export function createRoom(webSocket, roomData) {
  const response = {
    id: 0,
    type: roomData.type,
    data: '',
  };
  const newPlayer: Room = {
    roomId: rooms.length,
    roomUsers: [],
  };
  rooms.push(newPlayer);
  webSocket.send(`Roow with id ${newPlayer.roomId} registered`);
  console.log(rooms);
}
