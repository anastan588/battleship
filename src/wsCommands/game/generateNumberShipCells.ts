export function countNumberOfCellsWithShips(shipField) {
  let countOFSellsWithShips = 0;
  console.log(shipField);
  for (let i = 0; i < shipField.length; i++) {
    for (let k = 0; k < shipField[i].length; k++) {
      if (shipField[i][k] === 1) {
        countOFSellsWithShips++;
      }
    }
  }
    console.log(countOFSellsWithShips);
  return countOFSellsWithShips;
}
