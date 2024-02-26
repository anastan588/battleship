import { winners } from 'dataBase/gameDataBase';
import WebSocketWithId from 'types/dataTypes';

export function sendWinnersResponse(
  wsConnections: WebSocketWithId[]
) {
  const response = {
    id: 0,
    type: 'update_winners',
    data: '',
  };
  const winnersData = winners;
  response.data = JSON.stringify(winnersData);
  wsConnections.forEach((item) => item.send(JSON.stringify(response)));
}
