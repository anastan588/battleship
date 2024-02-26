import { games } from 'dataBase/gameDataBase';
import WebSocketWithId from 'types/dataTypes';

export function randomAttackGeneratorCell(
  webSocket: WebSocketWithId,
  randomAttackData
) {
  const randomAttackInfo = JSON.parse(randomAttackData.data);
  console.log(randomAttackData);
  const currentGame = games.find(
    (item) => item.idGame === randomAttackInfo.gameId
  );
  const playerWhoAttacksId = randomAttackInfo.indexPlayer;
  const playerWhoDefeted = currentGame.players.find(
    (item) => item.index !== playerWhoAttacksId
  );
  const gameField = playerWhoDefeted['shipsField'];
  let x = Math.floor(Math.random() * 10);
  let y = Math.floor(Math.random() * 10);
  console.log(x, y);
  while (Array.isArray(gameField[y][x]) && gameField[y][x][0] === 2) {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    console.log('circle');
  }
  const requestrandomAttackWithCell = {
    id: 0,
    type: 'attack',
    data: '',
  };
  const dataForRequestForrandomAttack = {
    gameId: randomAttackInfo.gameId,
    x: x,
    y: y,
    indexPlayer: randomAttackInfo.indexPlayer,
  };
  console.log(dataForRequestForrandomAttack);
  requestrandomAttackWithCell.data = JSON.stringify(dataForRequestForrandomAttack);
  return requestrandomAttackWithCell;
}
