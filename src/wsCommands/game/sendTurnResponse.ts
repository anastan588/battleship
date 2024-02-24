import WebSocketWithId from "types/dataTypes";

export function sendTurnResponse(wsConnectionInGame: WebSocketWithId, playerID) {
  const response = {
    id: 0,
    type: 'turn',
    data: '',
  };
  const currentPlayer = {
    currentPlayer: playerID, 
}
  response.data = JSON.stringify(currentPlayer);
  wsConnectionInGame.send(JSON.stringify(response));
}