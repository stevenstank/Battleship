const createShip = require('./ship');

function createGameboard() {
  const shipPositions = new Map();
  const ships = [];
  const misses = new Set();

  function coordKey([r, c]) {
    return `${r},${c}`;
  }

  function placeShip(length, coordinates) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new TypeError('length must be a positive integer');
    }
    if (!Array.isArray(coordinates) || coordinates.length !== length) {
      throw new Error('coordinates length must match ship length');
    }

    const ship = createShip(length);
    const posKeys = coordinates.map(coordKey);

    for (const key of posKeys) {
      if (shipPositions.has(key)) throw new Error('overlap detected');
    }

    ships.push({ ship, positions: posKeys });
    posKeys.forEach((key, idx) => shipPositions.set(key, { ship, index: idx }));
    return ship;
  }

  function receiveAttack(coordinate) {
    const key = coordKey(coordinate);
    if (misses.has(key)) return { result: 'repeat' };
    const pos = shipPositions.get(key);
    if (pos) {
      pos.ship.hit();
      return { result: 'hit', ship: pos.ship };
    }
    misses.add(key);
    return { result: 'miss' };
  }

  function getMisses() {
    return Array.from(misses).map((s) => s.split(',').map((n) => Number(n)));
  }

  function allSunk() {
    return ships.length > 0 && ships.every((s) => s.ship.isSunk());
  }

  function hasBeenAttacked(coordinate) {
    const key = coordKey(coordinate);
    return misses.has(key) || shipPositions.has(key);
  }

  function getShips() {
    return ships.map((s) => ({ ship: s.ship, positions: s.positions.slice() }));
  }

  return {
    placeShip,
    receiveAttack,
    getMisses,
    allSunk,
    hasBeenAttacked,
    getShips,
  };
}

module.exports = createGameboard;
