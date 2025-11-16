import WebSocketWithId from 'types/dataTypes';
import { games, players, winners, wsConnections } from 'dataBase/gameDataBase';
import { sendTurnResponse } from './sendTurnResponse';
import { sendFinishResponse } from './finishResponse';
import { sendWinnersResponse } from 'wsCommands/user/winnersResponse';
import { randomAttackGeneratorCell } from './randomAttack';

// --- Types for game field ---
export type Position = { y: number; x: number };

export type ShipCell = [
  number, // 0 = empty, 1 = intact ship, 2 = hit ship
  'small' | 'medium' | 'large' | 'huge',
  Position, // start position of the ship
  boolean, // direction: true = vertical, false = horizontal
  number // length of the ship
];

export type Cell = 0 | ShipCell;
export type GameField = Cell[][];

// --- Safe access helper ---
function safeCell(gameField: GameField, y: number, x: number): Cell | undefined {
  return gameField[Number(y)]?.[Number(x)];
}

// --- Circle shot helper ---
function markCircleShot(
  gameField: GameField,
  shipCells: Position[],
  wsSocketsInGame: WebSocketWithId[],
  attackInfo: any,
  response: any
) {
  const positions = getGroupNeighbors(gameField, shipCells);
  positions.forEach((position) => {
    const responseDataForCircle = {
      position,
      currentPlayer: attackInfo.indexPlayer,
      status: 'miss',
    };
    response.data = JSON.stringify(responseDataForCircle);
    wsSocketsInGame.forEach((item) => item.send(JSON.stringify(response)));
  });
}

// --- Neighbor finder ---
export function getGroupNeighbors(
  gameField: GameField,
  group: Position[],
  includeDiagonals = true
): Position[] {
  const directions: Position[] = [
    { y: -1, x: 0 },
    { y: 1, x: 0 },
    { y: 0, x: -1 },
    { y: 0, x: 1 },
  ];

  if (includeDiagonals) {
    directions.push(
      { y: -1, x: -1 },
      { y: -1, x: 1 },
      { y: 1, x: -1 },
      { y: 1, x: 1 }
    );
  }

  const neighbors: Position[] = [];

  for (const cell of group) {
    for (const d of directions) {
      const newY = cell.y + d.y;
      const newX = cell.x + d.x;
      const pos = { y: newY, x: newX };

      if (
        safeCell(gameField, newY, newX) !== undefined &&
        !group.some((g) => g.y === pos.y && g.x === pos.x) &&
        !neighbors.some((n) => n.y === pos.y && n.x === pos.x)
      ) {
        neighbors.push(pos);
      }
    }
  }
  return neighbors;
}

// --- Main attack function ---
export function attack(webSocket: WebSocketWithId, attackData: any) {
  const response = { id: 0, type: 'attack', data: '' };
  const attackInfo = JSON.parse(attackData.data);

  const responseData: any = {
    position: { x: attackInfo.x, y: attackInfo.y },
    currentPlayer: attackInfo.indexPlayer,
    status: undefined,
  };

  const currentGame = games.find((item) => item.idGame === attackInfo.gameId);
  if (!currentGame) return;

  const playerWhoAttacksId = attackInfo.indexPlayer;
  const playerWhoDefeted = currentGame.players.find(
    (item) => item.index !== playerWhoAttacksId
  );
  if (!playerWhoDefeted) return;
  const gameField: GameField = playerWhoDefeted.shipsField!;
  const x = attackInfo.x;
  const y = attackInfo.y;
  const wsSocketsInGame = wsConnections.filter((item) =>
    currentGame.players.some((player) => player.index === item.wsUser!.index)
  );

  const cell = safeCell(gameField, Number(y), Number(x));
  const shipCells: Position[] = [];
  if (Array.isArray(cell)) {

    playerWhoDefeted.countOfSuccessAttaks!++;

    if (cell[1] === 'small') {
      responseData.status = 'killed';
      shipCells.push(cell[2]);
      markCircleShot(
        gameField,
        shipCells,
        wsSocketsInGame,
        attackInfo,
        response
      );
      cell[0] = 2;
    } else {

      cell[0] = 2;
      const startPosition: Position = cell[2];
      const isVertical = cell[3];
      const shipLength = cell[4];

      let countOfShotCells = 0;

      shipCells.push({ y, x });
      if (cell[0] === 2) countOfShotCells++;


      let forwardY = y;
      let forwardX = x;
      for (let k = 1; k < shipLength; k++) {
        if (isVertical) forwardY++;
        else forwardX++;

        const currentCell = safeCell(gameField, forwardY, forwardX);
        if (!Array.isArray(currentCell)) break;

        if (currentCell[0] === 2) countOfShotCells++;
        shipCells.push({ y: forwardY, x: forwardX });
      }


      let backY = y;
      let backX = x;
      for (let k = 1; k < shipLength; k++) {
        if (isVertical) backY--;
        else backX--;

        const currentCell = safeCell(gameField, backY, backX);
        if (!Array.isArray(currentCell)) break;

        if (currentCell[0] === 2) countOfShotCells++;
        shipCells.push({ y: backY, x: backX });
      }


      if (countOfShotCells === shipLength) {
        responseData.status = 'killed';
        markCircleShot(
          gameField,
          shipCells,
          wsSocketsInGame,
          attackInfo,
          response
        );
      } else {
        responseData.status = 'shot';
      }
      if (responseData.status === 'killed') {
        markCircleShot(
          gameField,
          shipCells,
          wsSocketsInGame,
          attackInfo,
          response
        );
      }
    }
  } else if (cell === 0) {

    responseData.status = 'miss';
    const attackPlayer = currentGame.players.find(
      (item) => item.index === playerWhoAttacksId
    );
    const defetedPlayer = currentGame.players.find(
      (item) => item.index !== playerWhoAttacksId
    );
    if (attackPlayer && defetedPlayer) {
      attackPlayer.turn = false;
      defetedPlayer.turn = true;
    }
  }

  if (responseData.status === 'killed') {
    shipCells.forEach((shipcell) => {
      const responseDataAllShip = {
        position: shipcell,
        currentPlayer: attackInfo.indexPlayer,
        status: 'killed',
      };
      response.data = JSON.stringify(responseDataAllShip);
      wsSocketsInGame.forEach((shipcell) =>
        shipcell.send(JSON.stringify(response))
      );
    });
  } else {
    response.data = JSON.stringify(responseData);
    wsSocketsInGame.forEach((item) => item.send(JSON.stringify(response)));
  }


  if (
    playerWhoDefeted.numberOfSellsWithShips ===
    playerWhoDefeted.countOfSuccessAttaks
  ) {
    sendFinishResponse(wsSocketsInGame, playerWhoAttacksId);
    const winnerPlayer = players.find(
      (player) => player.index === playerWhoAttacksId
    );
    if (winnerPlayer) {
      const IFWinnerExist = winners.find(
        (winner) => winner.name === winnerPlayer.name
      );
      if (IFWinnerExist) {
        IFWinnerExist.wins += 1;
      } else {
        winners.push({ name: winnerPlayer.name, wins: 1 });
      }
      sendWinnersResponse(wsConnections);
    }
  } else {
    let playerForTurn: number | undefined;
    for (const p of currentGame.players) {
      if (p.turn === true) playerForTurn = p.index;
    }
    if (playerForTurn !== undefined) {
      wsSocketsInGame.forEach((item) => sendTurnResponse(item, playerForTurn));
      if (currentGame.isBot === true) {
        const playerTurnOrder = currentGame.players.find(
          (item) => item.index === playerForTurn
        );
        const plTurnINmassivePlayers = players.find(
          (item) => item.index === playerTurnOrder?.index
        );
        if (plTurnINmassivePlayers?.name.includes('bot')) {
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
          attack(webSocket, dataForAttack);
        }
      }
    }
  }
}
