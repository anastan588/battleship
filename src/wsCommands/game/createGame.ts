import {
  gameId,
  games,
  roomsInGame,
  setGameId,
  wsConnections,
} from 'dataBase/gameDataBase';
import WebSocketWithId, { Game } from 'types/dataTypes';
import { sendListRooms } from '../room/upDateRoomResponse';

export function createGame(webSocket: WebSocketWithId, roomIndex) {
  const response = {
    id: 0,
    type: 'create_game',
    data: '',
  };
  const responseData = {
    idGame: 0,
    idPlayer: 0,
  };
  let newgameId = gameId;
  const newGame: Game = {
    idGame: newgameId ,
    players: [],
    isBot: false,
  };
  newgameId++;
  setGameId(newgameId);
  roomsInGame[roomIndex].roomUsers.forEach((player) => {
    newGame.players.push(player);
  });
  games.push(newGame);
  responseData.idGame = newGame.idGame;

  const wsSocketsInGame = wsConnections.filter((item) =>
    newGame.players.some((player) => player.index === item.wsUser.index)
  );
  const wsSocketsNotInGame = wsConnections.filter((item) =>
    newGame.players.every((player) => player.index !== item.wsUser.index)
  );
  console.log(wsSocketsNotInGame.length);

  wsSocketsInGame.forEach((item) => {
    responseData.idPlayer = item.wsUser.index;
    response.data = JSON.stringify(responseData);
    item.send(JSON.stringify(response));
  });
  sendListRooms(wsConnections);
  console.log(games);
  console.log(roomsInGame);
}
