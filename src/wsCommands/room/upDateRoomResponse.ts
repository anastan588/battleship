import { rooms } from 'dataBase/gameDataBase';
import WebSocketWithId from 'types/dataTypes';

export function sendListRooms(wsConnections: WebSocketWithId[]) {
  const response = {
    id: 0,
    type: 'update_room',
    data: '',
  };
  response.data = JSON.stringify(rooms);
  wsConnections.forEach((item) => {
    item.send(JSON.stringify(response));
  });
  console.log(rooms);
}
