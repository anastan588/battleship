import { httpServer } from './src/http_server/index';
import dotenv from 'dotenv';
import { wsServer } from './src/websocket_server/index';
dotenv.config();

const HTTP_PORT = Number(process.env.HTTP_PORT) || 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer.on('close', () => {
  console.log('WebSocket server close');
});
