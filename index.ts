import { httpServer } from './src/http_server/index';
import dotenv from 'dotenv';
import { wsServer } from './src/websocket_server/index';
import { wsConnections } from './src/dataBase/gameDataBase';
import WebSocketWithId from './src/types/dataTypes';
dotenv.config();

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer.on('close', (webSocket: WebSocketWithId) => {
  const wsConnectionToCloseID = wsConnections.findIndex(
    (item) => webSocket.id === item.id
  );
  wsConnections.splice(wsConnectionToCloseID, 1);
  console.log(`WebSocket server with ${webSocket.id} was closed`);
});

