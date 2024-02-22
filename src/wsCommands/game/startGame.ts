import { games, players, wsConnections } from 'dataBase/gameDataBase';
import WebSocketWithId from 'types/dataTypes';

export function startGame(webSocket: WebSocketWithId, gameData) {
  const response = {
    id: 0,
    type: 'start_game',
    data: '',
  };
  const responseData = {
    ships: undefined,
    currentPlayerIndex: undefined,
  };
  const gamePlayerInfo = JSON.parse(gameData.data);
  const gameToStart = games.find(
    (item) => item.idGame === gamePlayerInfo.gameId
  );
  const playerToAddShipsPosition = gameToStart.players.find(
    (player) => player.index === webSocket.id
  );
  console.log(playerToAddShipsPosition);
  playerToAddShipsPosition.shipInfo = gamePlayerInfo.ships;
  if (gameToStart.players.every((players) => players.shipInfo !== undefined)) {
    const wsSocketsInGame = wsConnections.filter((item) =>
      gameToStart.players.some((player) => player.index === item.id)
    );
    wsSocketsInGame.forEach((item) => {
      const playerID = item.wsUser.index;
      const player = gameToStart.players.find(
        (user) => user.index === playerID
      );
      responseData.ships = player.shipInfo;
      responseData.currentPlayerIndex = player.index;
      response.data = JSON.stringify(responseData);
      item.send(JSON.stringify(response));
    });
  }
}
