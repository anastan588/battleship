import WebSocketWithId from 'types/dataTypes';
import { games, players, winners, wsConnections } from 'dataBase/gameDataBase';
import { sendTurnResponse } from './sendTurnResponse';
import { sendFinishResponse } from './finishResponse';
import { sendWinnersResponse } from 'wsCommands/user/winnersResponse';
import { randomAttackGeneratorCell } from './randomAttack';

export function attack(webSocket: WebSocketWithId, attackData) {
  const response = {
    id: 0,
    type: 'attack',
    data: '',
  };

  const attackInfo = JSON.parse(attackData.data);

  const responseData = {
    position: {
      x: attackInfo['x'],
      y: attackInfo['y'],
    },
    currentPlayer: attackInfo.indexPlayer,
    status: undefined,
  };

  const currentGame = games.find((item) => item.idGame === attackInfo.gameId);

  const playerWhoAttacksId = attackInfo.indexPlayer;
  const playerWhoDefeted = currentGame.players.find(
    (item) => item.index !== playerWhoAttacksId
  );

  const gameField = playerWhoDefeted['shipsField'];

  const x = attackInfo['x'];
  const y = attackInfo['y'];

  const wsSocketsInGame = wsConnections.filter((item) =>
    currentGame.players.some((player) => player.index === item.wsUser.index)
  );

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
    }
    sendWinnersResponse(wsConnections);
  } else {
    let playerForTurn = undefined;
    for (let i = 0; i < currentGame.players.length; i++) {
      if (currentGame.players[i].turn === true) {
        playerForTurn = currentGame.players[i].index;
      }
    }
    wsSocketsInGame.forEach((item) => sendTurnResponse(item, playerForTurn));
    if (currentGame.isBot === true) {
      const playerTurnOrder = currentGame.players.find(
        (item) => item.index === playerForTurn
      );
      const plTurnINmassivePlayers = players.find(
        (item) => (item.index = playerTurnOrder.index)
      );
      console.log(players);
      console.log(playerTurnOrder);
      console.log(plTurnINmassivePlayers);
      if (plTurnINmassivePlayers.name.includes('bot')) {
        const dataforrandomAttack = {
          type: 'randomAttack',
          data: JSON.stringify({
            gameId: currentGame.idGame,
            indexPlayer: playerForTurn,
          }),
          id: 0,
        };
        const dataForAttack = randomAttackGeneratorCell(
          webSocket,
          dataforrandomAttack
        );
        console.log(dataForAttack);
        attack(webSocket, dataForAttack);
      }
    }
  }
}
