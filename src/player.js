function createPlayer(type = 'human', gameboardFactory) {
  if (type !== 'human' && type !== 'computer') throw new TypeError('invalid player type');
  const gameboard = gameboardFactory();
  const movesMade = new Set();

  function attack(enemyGameboard, coord) {
    movesMade.add(coord.join(','));
    return enemyGameboard.receiveAttack(coord);
  }

  function randomAttack(enemyGameboard, boardSize = 10) {
    if (type !== 'computer') throw new Error('randomAttack is for computer players');
    let attempts = 0;
    while (attempts < 1000) {
      const r = Math.floor(Math.random() * boardSize);
      const c = Math.floor(Math.random() * boardSize);
      const key = `${r},${c}`;
      if (!movesMade.has(key)) {
        movesMade.add(key);
        return enemyGameboard.receiveAttack([r, c]);
      }
      attempts += 1;
    }
    throw new Error('no available moves');
  }

  function hasMadeMove(coord) {
    return movesMade.has(coord.join(','));
  }

  return {
    type,
    gameboard,
    attack,
    randomAttack,
    hasMadeMove,
  };
}

module.exports = createPlayer;
