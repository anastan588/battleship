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
import { countNumberOfCellsWithShips } from './generateNumberShipCells';
import { generateShipsField } from './generateShipsField';
import { generateShipsInfoForBot } from './generateRandomShipsInfo';
import { WebSocketServer } from 'ws';
import { requestHandler } from 'request_handler/reqHandler';
import { WS_PORT } from 'websocket_server';

export function createGameWithBot(
  wsConnection: WebSocketWithId,
  gameWithBotdata
) {
  const wsConnetionofSinglePlayer = wsConnections.find(
    (item) => item.id === wsConnection.id
  );
  const playerIDWithBot = wsConnetionofSinglePlayer.wsUser.index;
  const singlePlayer = players.find((item) => item.index === playerIDWithBot);
  const response = {
    id: 0,
    type: 'create_game',
    data: '',
  };
  const responseData = {
    idGame: 0,
    idPlayer: 0,
  };
  let newPlayerID = playerId;
  const newPlayerBot: User = {
    index: newPlayerID,
    name: `bot${newPlayerID}`,
    password: '12345',
  };
  newPlayerID ++;
  setUserId(newPlayerID);
  console.log(newPlayerBot);
  players.push(newPlayerBot);

  const newWsForBot = new WebSocketServer({ port: 3001 });
  newWsForBot.on('connection', (webSocket: WebSocketWithId, request) => {
    console.log('WebSocket connected');
    webSocket.id = webSocketId;
    const newWebsoketID = webSocketId + 1;
    setWebsoketId(newWebsoketID);
    webSocket.wsUser = newPlayerBot;
    wsConnections.push(webSocket);
    console.log(webSocket.id);
    webSocket.on('message', (message) => {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);
      requestHandler(webSocket, data);
    });
  });
  let newgameId = gameId;
  const newGame: Game = {
    idGame: newgameId,
    players: [],
    isBot: true,
  };
  newgameId++;
  setGameId(newgameId);
  const playerBot: RoomUser = {
    name: newPlayerBot.name,
    index: newPlayerBot.index,
    turn: false,
    numberOfSellsWithShips: 0,
    countOfSuccessAttaks: 0,
  };
  playerBot.shipInfo = generateShipsInfoForBot();
  playerBot.shipsField = generateShipsField(playerBot.shipInfo);
  playerBot.numberOfSellsWithShips = countNumberOfCellsWithShips(
    playerBot.shipsField
  );

  newGame.players.push(playerBot);
  console.log(newGame);
  const singlePlayerWithBot: RoomUser = {
    name: singlePlayer.name,
    index: singlePlayer.index,
    turn: false,
    numberOfSellsWithShips: 0,
    countOfSuccessAttaks: 0,
  };
  newGame.players.push(singlePlayerWithBot);

  games.push(newGame);
  responseData.idGame = newGame.idGame;
  const wsSocketsInGame = wsConnections.filter((item) =>
    newGame.players.some((player) => player.index === item.wsUser.index)
  );
  wsSocketsInGame.forEach((item) => {
    responseData.idPlayer = item.wsUser.index;
    response.data = JSON.stringify(responseData);
    item.send(JSON.stringify(response));
  });
}
