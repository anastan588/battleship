import { players } from 'dataBase/gameDataBase';
import { ResponseRegistration, User } from 'types/dataTypes';

export function registerCreateUser(webSocket, userData) {
  const response = {
    id: 0,
    type: userData.type,
    data: '',
  };
  const { name, password } = JSON.parse(userData.data);
  const findPlayer = players.filter((item) => (item.name = name));
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
    response.data = JSON.stringify(resPlayerData);
    webSocket.send(JSON.stringify(response));
  } else if (findPlayer.length === 0) {
    createPlayer(webSocket, name, password, response);
  }
}

function createPlayer(webSocket, username, userpassword, response) {
  const newPlayer: User = {
    index: players.length,
    name: username,
    password: userpassword,
  };
  console.log(newPlayer);
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
}
