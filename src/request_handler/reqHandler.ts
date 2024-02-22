import { addSecondPlayerToRoom } from 'wsCommands/addSecondPlayerToRoom';
import { createGame } from 'wsCommands/createGame';
import { createRoom } from 'wsCommands/createRoom';
import { registerCreateUser } from 'wsCommands/registerCreateUser';

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
    default:
      break;
  }
}
