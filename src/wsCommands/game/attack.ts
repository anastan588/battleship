import WebSocketWithId from 'types/dataTypes';
import { games, wsConnections } from 'dataBase/gameDataBase';

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
  if (Array.isArray(gameField[y][x])) {
    if (gameField[y][x][1] === 'small') {
      responseData.status = 'killed';
      gameField[y][x][0] = 2;
    } else if (
      gameField[y][x][1] === 'large' ||
      gameField[y][x][1] === 'medium' ||
      gameField[y][x][1] === 'huge'
    ) {
      gameField[y][x][0] = 2;
      const startPosition = gameField[y][x][2];
      let startPositionX = startPosition.x;
      let startPositionY = startPosition.y;
      if (gameField[y][x][3] === true) {
        for (let k = 1; k <= gameField[y][x][4]; k++) {
          let countOfShotCells = 1;
          console.log('popka');
          if (gameField[startPositionY][startPositionX][0] === 2) {
            countOfShotCells++;
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
        for (let k = 1; k <= gameField[y][x][4]; k++) {
          let countOfShotCells = 1;
          console.log('pupka');
          if (gameField[startPositionY][startPositionX][0] === 2) {
            countOfShotCells++;
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
  }
  response.data = JSON.stringify(responseData);
  wsSocketsInGame.forEach((item) => item.send(JSON.stringify(response)));
}
