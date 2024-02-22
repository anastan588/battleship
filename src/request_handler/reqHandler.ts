import { addSecondPlayerToRoom } from 'wsCommands/room/addSecondPlayerToRoom';
import { createGame } from 'wsCommands/game/createGame';
import { createRoom } from 'wsCommands/room/createRoom';
import { registerCreateUser } from 'wsCommands/user/registerCreateUser';
import { startGame } from 'wsCommands/game/startGame';

export function requestHandler(webSocket, data) {
  switch (data.type) {
    case 'create_room':
      createRoom(webSocket, data);
      break;
    case 'reg':
      console.log(data);
      registerCreateUser(webSocket, data);
      break;
    case 'add_user_to_room':
      addSecondPlayerToRoom(webSocket, data);
      break;
    case 'add_ships':
      startGame(webSocket, data);
      break;
    default:
      break;
  }
}
