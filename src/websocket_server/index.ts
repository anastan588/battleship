import {
  setWebsoketId,
  webSocketId,
  wsConnections,
} from 'dataBase/gameDataBase';
import { requestHandler } from 'request_handler/reqHandler';
import WebSocketWithId from 'types/dataTypes';
import { WebSocketServer } from 'ws';

export const WS_PORT = 3000;

const wsServer = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server started on port ${WS_PORT}`);

wsServer.on('connection', (webSocket: WebSocketWithId, request) => {
  console.log('WebSocket connected');
  webSocket.id = webSocketId;
  const newWebsoketID = webSocketId + 1;
  setWebsoketId(newWebsoketID);
  wsConnections.push(webSocket);
  console.log(webSocket.id);
  webSocket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log('Received message:', data);
    requestHandler(webSocket, data);
  });
});



export { wsServer };
