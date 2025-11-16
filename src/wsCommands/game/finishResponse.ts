import WebSocketWithId from 'types/dataTypes';

export function sendFinishResponse(
  wsConnectionInGame: WebSocketWithId[],
  playerID: number
) {
  const response = {
    id: 0,
    type: 'finish',
    data: '',
  };
  const winPlayer = {
    winPlayer: playerID,
  };
  response.data = JSON.stringify(winPlayer);
  wsConnectionInGame.forEach((item) => item.send(JSON.stringify(response)));
}
