import { games, wsConnections } from 'dataBase/gameDataBase';
import WebSocketWithId from 'types/dataTypes';
import { generateShipsField } from './generateShipsField';
import { sendTurnResponse } from './sendTurnResponse';
import { countNumberOfCellsWithShips } from './generateNumberShipCells';

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
    (player) => player.index === webSocket.wsUser.index
  );
  console.log(playerToAddShipsPosition);
  playerToAddShipsPosition.shipInfo = gamePlayerInfo.ships;
  if (gameToStart.players.every((players) => players.shipInfo !== undefined)) {
    playerToAddShipsPosition.turn = true;

    gameToStart.players.every(
      (player) => (player.shipsField = generateShipsField(player.shipInfo))
    );

    gameToStart.players.every(
      (player) =>
        (player.countOFSellsWithShips = countNumberOfCellsWithShips(
          player.shipsField
        ))
    );
    gameToStart.players.every((player) => (player.countOfSuccessAttaks = 0));
    const wsSocketsInGame = wsConnections.filter((item) =>
      gameToStart.players.some((player) => player.index === item.wsUser.index)
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

    let playerForTurn = undefined;

    for (let i = 0; i < gameToStart.players.length; i++) {
      if (gameToStart.players[i].turn === true) {
        playerForTurn = gameToStart.players[i].index;

        for (let k = 0; k < wsSocketsInGame.length; k++) {
          if (
            wsSocketsInGame[k].wsUser.index !== gameToStart.players[i].index
          ) {
            sendTurnResponse(wsSocketsInGame[k], playerForTurn);
          }
        }
      }
    }
  } else if (
    gameToStart.players.some((players) => players.shipInfo === undefined)
  ) {
    playerToAddShipsPosition.turn = false;
  }
}
