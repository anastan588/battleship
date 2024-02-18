import fs from 'fs';
import path from 'path';
import http from 'http';
import WebSocket from 'ws';

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});


const webSocketServer = WebSocket.createWebSocketStream({ server: httpServer });

webSocketServer.on('connection', (webSocket) => {
    console.log('WebSocket connected');
    webSocket.on('message', (message) => {
      console.log('Received message:', message);
      webSocket.send(`Response from server: ${message}`);
    });
    webSocket.on('close', () => {
      console.log('WebSocket disconnected');
    });
  });
  


