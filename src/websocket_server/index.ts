import { requestHandler } from 'request_handler/reqHandler';
import { WebSocketServer } from 'ws';

const WS_PORT = 3000;

const wsServer = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server started on port ${WS_PORT}`);

wsServer.on('connection', (webSocket, request) => {
  console.log('WebSocket connected');
  webSocket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log('Received message:', data);
    requestHandler(webSocket, data)
    
  });
});

export { wsServer };
