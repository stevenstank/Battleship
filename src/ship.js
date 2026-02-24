function createShip(length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('length must be a positive integer');
  }

  let hits = 0;

  return {
    length,
    hit() {
      if (hits < length) hits += 1;
      return hits;
    },
    getHits() {
      return hits;
    },
    isSunk() {
      return hits >= length;
    }
  };
}

module.exports = createShip;
