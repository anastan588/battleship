import { WebSocketServer } from 'ws';

const WS_PORT = 3000;

const wsServer = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server started on port ${WS_PORT}`);

wsServer.on('connection', (webSocket, request) => {
  console.log('WebSocket connected');
  console.log(request.socket);
  webSocket.on('message', (message) => {
    console.log('Received message:', message);
    webSocket.send(`Response from server: ${message}`);
  });
});

export { wsServer };
