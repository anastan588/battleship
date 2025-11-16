type Position = { x: number; y: number };
type ShipInfo = {
  position: Position;
  direction: boolean;
  type: 'huge' | 'large' | 'medium' | 'small';
  length: number;
};

const FLEET: { type: ShipInfo['type']; length: number; count: number }[] = [
  { type: 'huge', length: 4, count: 1 },
  { type: 'large', length: 3, count: 2 },
  { type: 'medium', length: 2, count: 3 },
  { type: 'small', length: 1, count: 4 },
];

export function generateRandomShipsInfo(): ShipInfo[] {
  const SIZE = 10;
  const field: number[][] = Array.from({ length: SIZE }, () =>
    new Array(SIZE).fill(0)
  );
  const ships: ShipInfo[] = [];

  function canPlace(x: number, y: number, length: number, vertical: boolean): boolean {
    for (let i = 0; i < length; i++) {
      const cx = vertical ? x : x + i;
      const cy = vertical ? y + i : y;

      if (cx < 0 || cx >= SIZE || cy < 0 || cy >= SIZE) return false;
      if (field[cy][cx] !== 0) return false;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
            if (field[ny][nx] !== 0) return false;
          }
        }
      }
    }
    return true;
  }

  function placeShip(type: ShipInfo['type'], length: number) {
    let placed = false;
    while (!placed) {
      const vertical = Math.random() < 0.5;
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);

      if (canPlace(x, y, length, vertical)) {
        for (let i = 0; i < length; i++) {
          const cx = vertical ? x : x + i;
          const cy = vertical ? y + i : y;
          field[cy][cx] = 1;
        }
        ships.push({ position: { x, y }, direction: vertical, type, length });
        placed = true;
      }
    }
  }

  for (const { type, length, count } of FLEET) {
    for (let i = 0; i < count; i++) {
      placeShip(type, length);
    }
  }

  return ships;
}
