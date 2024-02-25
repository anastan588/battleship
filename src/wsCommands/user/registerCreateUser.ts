import {
  currentPlayersOfGame,
  playerId,
  players,
  setUserId,
  wsConnections,
} from 'dataBase/gameDataBase';
import WebSocketWithId, { ResponseRegistration, User } from 'types/dataTypes';
import { sendListRooms } from '../room/upDateRoomResponse';

export function registerCreateUser(webSocket: WebSocketWithId, userData) {
  const response = {
    id: 0,
    type: userData.type,
    data: '',
  };
  const { name, password } = JSON.parse(userData.data);
  const findPlayer = players.filter((item) => item.name === name);
  console.log(findPlayer);
  if (findPlayer.length === 1) {
    let resPlayerData: ResponseRegistration = {
      index: findPlayer[0].index,
      name: findPlayer[0].name,
      error: false,
      errorText: '',
    };
    if (findPlayer[0].password !== password) {
      resPlayerData = {
        index: findPlayer[0].index,
        name: findPlayer[0].name,
        error: true,
        errorText: 'Your Password is wrong',
      };
    }
    if (findPlayer[0].password === password) {
      currentPlayersOfGame.push(findPlayer[0]);
      webSocket.wsUser = findPlayer[0];
    }
    response.data = JSON.stringify(resPlayerData);
    webSocket.send(JSON.stringify(response));
    if (findPlayer[0].password === password) {
      sendListRooms(wsConnections);
    }
  } else if (findPlayer.length === 0) {
    createPlayer(webSocket, name, password, response);
  }
}

function createPlayer(
  webSocket: WebSocketWithId,
  username,
  userpassword,
  response
) {
  let newPlayerID = playerId;
  const newPlayer: User = {
    index: newPlayerID,
    name: username,
    password: userpassword,
  };
  newPlayerID ++;
  setUserId(newPlayerID);
  console.log(newPlayer);
  currentPlayersOfGame.push(newPlayer);
  webSocket.wsUser = newPlayer;
  players.push(newPlayer);
  const resPlayerData: ResponseRegistration = {
    index: newPlayer.index,
    name: newPlayer.name,
    error: false,
    errorText: '',
  };
  response.data = JSON.stringify(resPlayerData);
  webSocket.send(JSON.stringify(response));
  console.log(players);
  sendListRooms(wsConnections);
}
