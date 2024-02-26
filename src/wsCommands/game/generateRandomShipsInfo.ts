export function generateShipsInfoForBot() {
const shipsField = Array.from({ length: 10 }, () => new Array(10).fill(0));
  const hugeShipObject = {
    count: 1,
    length: 4,
    type: 'huge',
  };
  const largeShipObject = {
    count: 2,
    length: 3,
    type: 'large',
  };
  const mediumShipObject = {
    count: 3,
    length: 2,
    type: 'medium',
  };
  const smallShipObject = {
    count: 4,
    length: 1,
    type: 'small',
  };
  const shipsInfoObject = [];

  for (let i = 1; i <= hugeShipObject.count; i++) {
    const shipInFOItem = {
      position: { x: 0, y: 0 },
      direction: undefined,
      type: '',
      length: 0,
    };
    const direction = generateRandomShipDirection();
    console.log(direction);
    const rows = 10;
    const cols = 10;
    const randomPosition = {
      x: 0,
      y: 0,
    };
    if (!direction) {
      randomPosition.x = Math.floor(Math.random() * (cols - hugeShipObject.length + 1));
      randomPosition.y = Math.floor(Math.random() * rows);
    } else {
      randomPosition.x = Math.floor(Math.random() * cols);
      randomPosition.y = Math.floor(Math.random() * (rows - hugeShipObject.length + 1));
    }
    shipInFOItem.direction = direction;
    shipInFOItem.type = hugeShipObject.type;
    shipInFOItem.length = hugeShipObject.length;
    shipInFOItem.position.x = randomPosition.x;
    shipInFOItem.position.y = randomPosition.y;
    shipsInfoObject.push(shipInFOItem)
  }
  for (let i = 1; i <= largeShipObject.count; i++) {
    const shipInFOItem = {
      position: { x: 0, y: 0 },
      direction: undefined,
      type: '',
      length: 0,
    };
    const direction = generateRandomShipDirection();
    console.log(direction);
    const rows = 10;
    const cols = 10;
    const randomPosition = {
      x: 0,
      y: 0,
    };
    if (!direction) {
      randomPosition.x = Math.floor(Math.random() * (cols - largeShipObject.length + 1));
      randomPosition.y = Math.floor(Math.random() * rows);
    } else {
      randomPosition.x = Math.floor(Math.random() * cols);
      randomPosition.y = Math.floor(Math.random() * (rows - largeShipObject.length + 1));
    }
    shipInFOItem.direction = direction;
    shipInFOItem.type = largeShipObject.type;
    shipInFOItem.length = largeShipObject.length;
    shipInFOItem.position.x = randomPosition.x;
    shipInFOItem.position.y = randomPosition.y;
    shipsInfoObject.push(shipInFOItem)
  }
  for (let i = 1; i <= mediumShipObject.count; i++) {
    const shipInFOItem = {
      position: { x: 0, y: 0 },
      direction: undefined,
      type: '',
      length: 0,
    };
    const direction = generateRandomShipDirection();
    console.log(direction);
    const rows = 10;
    const cols = 10;
    const randomPosition = {
      x: 0,
      y: 0,
    };
    if (!direction) {
      randomPosition.x = Math.floor(Math.random() * (cols - mediumShipObject.length + 1));
      randomPosition.y = Math.floor(Math.random() * rows);
    } else {
      randomPosition.x = Math.floor(Math.random() * cols);
      randomPosition.y = Math.floor(Math.random() * (rows - mediumShipObject.length + 1));
    }
    shipInFOItem.direction = direction;
    shipInFOItem.type = mediumShipObject.type;
    shipInFOItem.length = mediumShipObject.length;
    shipInFOItem.position.x = randomPosition.x;
    shipInFOItem.position.y = randomPosition.y;
    shipsInfoObject.push(shipInFOItem)
  }
  for (let i = 1; i <= smallShipObject.count; i++) {
    console.log('small');
    const shipInFOItem = {
      position: { x: 0, y: 0 },
      direction: undefined,
      type: '',
      length: 0,
    };
    const direction = generateRandomShipDirection();
    console.log(direction);
    const rows = 10;
    const cols = 10;
    const randomPosition = {
      x: 0,
      y: 0,
    };
    if (!direction) {
      randomPosition.x = Math.floor(Math.random() * (cols - smallShipObject.length + 1));
      randomPosition.y = Math.floor(Math.random() * rows);
    } else {
      randomPosition.x = Math.floor(Math.random() * cols);
      randomPosition.y = Math.floor(Math.random() * (rows - smallShipObject.length + 1));
    }
    shipInFOItem.direction = direction;
    shipInFOItem.type = smallShipObject.type;
    shipInFOItem.length = smallShipObject.length;
    shipInFOItem.position.x = randomPosition.x;
    shipInFOItem.position.y = randomPosition.y;
    shipsInfoObject.push(shipInFOItem)
  }
  console.log(shipsInfoObject);
  return shipsInfoObject;
}

function generateRandomShipDirection() {
    return Math.random() < 0.5 ? true : false;
};