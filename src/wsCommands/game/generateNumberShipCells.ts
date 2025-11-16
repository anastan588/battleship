export function countNumberOfCellsWithShips(shipField: string | any[]) {
  let countOFSellsWithShips = 0;
  for (let i = 0; i < shipField.length; i++) {
    for (let k = 0; k < shipField[i].length; k++) {
      if (Array.isArray(shipField[i][k])) {
        if (shipField[i][k][0] === 1) {
          countOFSellsWithShips++;
        }
      }
    }
  }
  return countOFSellsWithShips;
}
