import WebSocketWithId from 'types/dataTypes';
import { games, players, winners, wsConnections } from 'dataBase/gameDataBase';
import { sendTurnResponse } from './sendTurnResponse';
import { sendFinishResponse } from './finishResponse';
import { sendWinnersResponse } from 'wsCommands/user/winnersResponse';

export function attack(webSocket: WebSocketWithId, attackData) {
  const response = {
    id: 0,
    type: 'attack',
    data: '',
  };

  const attackInfo = JSON.parse(attackData.data);
  console.log(attackInfo);
  const responseData = {
    position: {
      x: attackInfo['x'],
      y: attackInfo['y'],
    },
    currentPlayer: attackInfo.indexPlayer,
    status: undefined,
  };
  console.log(responseData);
  const currentGame = games.find((item) => item.idGame === attackInfo.gameId);
  const playerWhoAttacksId = attackInfo.indexPlayer;
  const playerWhoDefeted = currentGame.players.find(
    (item) => item.index !== playerWhoAttacksId
  );
  console.log(playerWhoDefeted);
  const gameField = playerWhoDefeted['shipsField'];
  console.log(gameField);
  const x = attackInfo['x'];
  const y = attackInfo['y'];
  console.log(x, y);
  const wsSocketsInGame = wsConnections.filter((item) =>
    currentGame.players.some((player) => player.index === item.wsUser.index)
  );
  console.log(gameField[y][x]);
  console.log(playerWhoDefeted['countOfSuccessAttaks']);

  if (Array.isArray(gameField[y][x])) {
    playerWhoDefeted['countOfSuccessAttaks']++;
    if (gameField[y][x][1] === 'small') {
      responseData.status = 'killed';
      gameField[y][x][0] = 2;
    } else if (
      gameField[y][x][1] === 'large' ||
      gameField[y][x][1] === 'medium' ||
      gameField[y][x][1] === 'huge'
    ) {
      gameField[y][x][0] = 2;
      console.log(gameField[y][x][0]);
      const startPosition = gameField[y][x][2];
      let startPositionX = startPosition.x;
      let startPositionY = startPosition.y;
      if (gameField[y][x][3] === true) {
        let countOfShotCells = 0;
        for (let k = 1; k <= gameField[y][x][4]; k++) {
          console.log('popka');
          if (gameField[startPositionY][startPositionX][0] === 2) {
            countOfShotCells += 1;
            console.log(k);
            console.log(countOfShotCells);
            if (
              k === gameField[y][x][4] &&
              countOfShotCells === gameField[y][x][4]
            ) {
              responseData.status = 'killed';
            }
          } else if (gameField[startPositionY][startPositionX][0] === 1) {
            responseData.status = 'shot';
          }
          startPositionY++;
        }
      } else if (gameField[y][x][3] === false) {
        let countOfShotCells = 0;
        for (let k = 1; k <= gameField[y][x][4]; k++) {
          console.log('pupka');
          console.log(gameField[startPositionY][startPositionX]);
          if (gameField[startPositionY][startPositionX][0] === 2) {
            countOfShotCells += 1;

            console.log(k);
            console.log(countOfShotCells);
            if (
              k === gameField[y][x][4] &&
              countOfShotCells === gameField[y][x][4]
            ) {
              responseData.status = 'killed';
            }
          } else if (gameField[startPositionY][startPositionX][0] === 1) {
            responseData.status = 'shot';
          }
          startPositionX++;
        }
      }
    }
  } else if (gameField[y][x] === 0) {
    responseData.status = 'miss';
    console.log('pipka');
    const attackPlayer = currentGame.players.find(
      (item) => item.index === playerWhoAttacksId
    );
    const defetedPlayer = currentGame.players.find(
      (item) => item.index !== playerWhoAttacksId
    );
    attackPlayer.turn = false;
    defetedPlayer.turn = true;
  }
  response.data = JSON.stringify(responseData);
  wsSocketsInGame.forEach((item) => item.send(JSON.stringify(response)));
  console.log(
    playerWhoDefeted['numberOfSellsWithShips'],
    playerWhoDefeted['countOfSuccessAttaks']
  );
  if (
    playerWhoDefeted['numberOfSellsWithShips'] ===
    playerWhoDefeted['countOfSuccessAttaks']
  ) {
    sendFinishResponse(wsSocketsInGame, playerWhoAttacksId);
    const winnerPlayer = players.find(
      (player) => player.index === playerWhoAttacksId
    );
    const IFWinnerExist = winners.find(
      (winner) => winner.name === winnerPlayer.name
    );
    if (IFWinnerExist) {
      IFWinnerExist.wins += 1;
    } else {
      const winnerObject = {
        name: winnerPlayer.name,
        wins: 1,
      };
      winners.push(winnerObject);
      console.log(winners);
    }
    sendWinnersResponse(wsConnections);
  } else {
    let playerForTurn = undefined;
    for (let i = 0; i < currentGame.players.length; i++) {
      if (currentGame.players[i].turn === true) {
        playerForTurn = currentGame.players[i].index;

        // for (let k = 0; k < wsSocketsInGame.length; k++) {
        //   if (wsSocketsInGame[k].wsUser.index !== currentGame.players[i].index) {
        //     sendTurnResponse(wsSocketsInGame[k], playerForTurn);
        //   }
        // }
      }
    }
    wsSocketsInGame.forEach((item) => sendTurnResponse(item, playerForTurn));
  }
}
