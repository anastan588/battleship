export function generateShipsField(shipInfo) {
  //   console.log(shipInfo);
  const shipsField = Array.from({ length: 10 }, () => new Array(10).fill(0));
  for (let i = 0; i < shipInfo.length; i++) {
    let x = shipInfo[i].position['x'];
    let y = shipInfo[i].position['y'];
    // console.log(x, y);
    shipsField[y][x] = [
      1,
      shipInfo[i].type,
      shipInfo[i].position,
      shipInfo[i].direction,
      shipInfo[i].length,
    ];
    // console.log(shipsField[x][y]);
    if (shipInfo[i].direction === true && shipInfo.length > 1) {
      for (let k = 2; k <= shipInfo[i].length; k++) {
        y++;
        shipsField[y][x] = [
          1,
          shipInfo[i].type,
          shipInfo[i].position,
          shipInfo[i].direction,
          shipInfo[i].length,
        ];
      }
    } else if (shipInfo[i].direction === false && shipInfo[i].length > 1) {
      for (let k = 2; k <= shipInfo[i].length; k++) {
        x++;
        shipsField[y][x] = [
          1,
          shipInfo[i].type,
          shipInfo[i].position,
          shipInfo[i].direction,
          shipInfo[i].length,
        ];
      }
    }
  }
  console.log(shipsField);
  return shipsField;
}
