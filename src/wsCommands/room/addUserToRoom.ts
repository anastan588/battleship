import { games, rooms } from 'dataBase/gameDataBase';
import WebSocketWithId, { Game, Room } from 'types/dataTypes';

export function createGame(webSocket: WebSocketWithId, roomData) {
  const response = {
    id: 0,
    type: 'create_game',
    data: {
      idGame: 0,
      idPlayer: 0,
    },
  };
  const newGame: Game = {
    idGame: games.length,
    players: [],
    isBot: false,
  };
  newGame.players.push(webSocket.wsUser);
  games.push(newGame);
  response.data.idGame = newGame.idGame;
  response.data.idPlayer = webSocket.wsUser.index;
  webSocket.send(JSON.stringify(response));
  console.log(games);
}
