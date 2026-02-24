const createPlayer = require('../src/player');
const createGameboard = require('../src/gameboard');

describe('Player public interface', () => {
  test('player contains its own gameboard', () => {
    const player = createPlayer('human', createGameboard);
    expect(player.gameboard).toBeDefined();
  });

  test('attack calls enemy gameboard.receiveAttack and records move', () => {
    const player = createPlayer('human', createGameboard);
    const enemy = createPlayer('human', createGameboard);
    enemy.gameboard.placeShip(1, [[0,0]]);
    const res = player.attack(enemy.gameboard, [0,0]);
    expect(res.result).toBe('hit');
    expect(player.hasMadeMove([0,0])).toBe(true);
  });

  test('computer randomAttack performs a legal move', () => {
    const comp = createPlayer('computer', createGameboard);
    const enemy = createPlayer('human', createGameboard);
    const res = comp.randomAttack(enemy.gameboard, 5);
    expect(['hit','miss','repeat']).toContain(res.result);
  });
});
