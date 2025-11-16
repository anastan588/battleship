import {
  gameId,
  games,
  playerId,
  players,
  setGameId,
  setUserId,
  setWebsoketId,
  webSocketId,
  wsConnections,
} from 'dataBase/gameDataBase';
import WebSocketWithId, { Game, RoomUser, User } from 'types/dataTypes';
import { WebSocketServer } from 'ws';
import { requestHandler } from 'request_handler/reqHandler';

export function createGameWithBot(
  wsConnection: WebSocketWithId,
  gameWithBotdata: any
) {
  const wsConnectionOfSinglePlayer = wsConnections.find(
    (item) => item.id === wsConnection.id
  );
  if (!wsConnectionOfSinglePlayer || !wsConnectionOfSinglePlayer.wsUser) return;

  const playerIDWithBot = wsConnectionOfSinglePlayer.wsUser.index;
  const singlePlayer = players.find((item) => item.index === playerIDWithBot);
  if (!singlePlayer) return;

  const response = { id: 0, type: 'create_game', data: '' };
  const responseData = { idGame: 0, idPlayer: 0 };

  let newPlayerID = playerId;
  const newPlayerBot: User = {
    index: newPlayerID,
    name: `bot${newPlayerID}`,
    password: '12345',
  };
  setUserId(++newPlayerID);
  players.push(newPlayerBot);

  const newWsForBot = createBotServer(3001);
  newWsForBot.on('connection', (webSocket: WebSocketWithId) => {
    console.log('Bot WebSocket connected');
    webSocket.id = webSocketId;
    setWebsoketId(webSocketId + 1);
    webSocket.wsUser = newPlayerBot;
    wsConnections.push(webSocket);

    webSocket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Bot received message:', data);
        requestHandler(webSocket, data);
      } catch (err) {
        console.error('Invalid bot message:', err);
      }
    });
  });

 
  let newGameId = gameId;
  const newGame: Game = {
    idGame: newGameId,
    players: [],
    isBot: true,
  };
  setGameId(++newGameId);

  const playerBot: RoomUser = {
    name: newPlayerBot.name,
    index: newPlayerBot.index,
    turn: false,
    numberOfSellsWithShips: 0,
    countOfSuccessAttaks: 0,
  };

  const singlePlayerWithBot: RoomUser = {
    name: singlePlayer.name,
    index: singlePlayer.index,
    turn: false,
    numberOfSellsWithShips: 0,
    countOfSuccessAttaks: 0,
  };

  newGame.players.push(playerBot, singlePlayerWithBot);
  games.push(newGame);

  // --- Send response to players in game ---
  responseData.idGame = newGame.idGame;
  const wsSocketsInGame = wsConnections.filter(
    (item) =>
      item.wsUser &&
      newGame.players.some((player) => player.index === item.wsUser.index)
  );

  wsSocketsInGame.forEach((item) => {
    if (!item.wsUser) return;
    responseData.idPlayer = item.wsUser.index;
    response.data = JSON.stringify(responseData);
    item.send(JSON.stringify(response));
  });

  console.log('Game created with bot:', newGame);
}

function createBotServer(preferredPort: number) {
  let port = preferredPort;

  const server = new WebSocketServer({ port });

  server.on('listening', () => {
    console.log(`Bot WebSocket server running on port ${port}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying a random port...`);
      port = Math.floor(Math.random() * (65535 - 1024)) + 1024;

      const fallbackServer = new WebSocketServer({ port });
      fallbackServer.on('listening', () => {
        console.log(`Bot WebSocket server running on random port ${port}`);
      });
      return fallbackServer;
    } else {
      console.error('WebSocket server error:', err);
    }
  });

  return server;
}
