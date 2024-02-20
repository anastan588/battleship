import { createRoom } from "wsCommands/createRoom";
import { registerCreateUser } from "wsCommands/registerCreateUser";

export function requestHandler(webSocket,data) {
    switch (data.type) {
        case 'create_room':
            createRoom(webSocket, data);
          break;
        case 'reg':
            console.log(data);
            registerCreateUser(webSocket, data)
            break;
        case 'placeShips':
          break;
        default:
          break;
      }
}