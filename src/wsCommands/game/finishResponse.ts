import WebSocketWithId from 'types/dataTypes';

export function sendFinishResponse(
  wsConnectionInGame: WebSocketWithId[],
  playerID
) {
  const response = {
    id: 0,
    type: 'finish',
    data: '',
  };
  const winPlayer = {
    winPlayer: playerID,
  };
  console.log(playerID);
  console.log(winPlayer);
  response.data = JSON.stringify(winPlayer);
  wsConnectionInGame.forEach((item) => item.send(JSON.stringify(response)));
}
