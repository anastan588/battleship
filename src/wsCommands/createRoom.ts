import { roomId, rooms, setRoomId, wsConnections } from 'dataBase/gameDataBase';
import { Room } from 'types/dataTypes';
import { addPlayerToNewRoom } from './addPlayerToRoom';
import { sendListRooms } from './upDateRoomResponse';

export function createRoom(webSocket, roomData) {
  const newRoom: Room = {
    roomId: roomId,
    roomUsers: [],
  };
  const newRoomId = roomId +1;
  setRoomId(newRoomId);
  addPlayerToNewRoom(webSocket, newRoom);
  rooms.push(newRoom);
  sendListRooms(wsConnections);
}
