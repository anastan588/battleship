import { addSecondPlayerToRoom } from 'wsCommands/room/addSecondPlayerToRoom';
import { createRoom } from 'wsCommands/room/createRoom';
import { registerCreateUser } from 'wsCommands/user/registerCreateUser';
import { startGame } from 'wsCommands/game/startGame';
import { attack } from 'wsCommands/game/attack';
import { sendWinnersResponse } from 'wsCommands/user/winnersResponse';
import { wsConnections } from 'dataBase/gameDataBase';
import { randomAttackGeneratorCell } from 'wsCommands/game/randomAttack';
import { createGameWithBot } from 'wsCommands/game/gameWithBot';

export function requestHandler(webSocket, data) {
  switch (data.type) {
    case 'create_room':
      createRoom(webSocket, data);
      sendWinnersResponse(wsConnections);
      break;
    case 'reg':
      console.log(data);
      registerCreateUser(webSocket, data);
      sendWinnersResponse(wsConnections);
      break;
    case 'add_user_to_room':
      addSecondPlayerToRoom(webSocket, data);
      break;
    case 'add_ships':
      startGame(webSocket, data);
      break;
    case 'attack':
      attack(webSocket, data);
      break;
    case 'randomAttack':
      const dataForAttack = randomAttackGeneratorCell(webSocket, data);
      attack(webSocket, dataForAttack);
      break;
    case 'single_play':
      createGameWithBot(webSocket, data);
      break;     
    default:
      break;
  }
}
