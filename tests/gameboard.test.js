const createGameboard = require('../src/gameboard');

describe('Gameboard public interface', () => {
  test('places a ship and reports it in getShips', () => {
    const gb = createGameboard();
    const coords = [[0,0],[0,1],[0,2]];
    const ship = gb.placeShip(3, coords);
    const ships = gb.getShips();
    expect(ships.length).toBe(1);
    expect(ships[0].positions).toEqual(['0,0','0,1','0,2']);
    expect(ship.getHits()).toBe(0);
  });

  test('receiveAttack hits ship and records hit', () => {
    const gb = createGameboard();
    const coords = [[1,1],[1,2]];
    const ship = gb.placeShip(2, coords);
    const res = gb.receiveAttack([1,1]);
    expect(res.result).toBe('hit');
    expect(ship.getHits()).toBe(1);
  });

  test('receiveAttack records misses', () => {
    const gb = createGameboard();
    gb.placeShip(2, [[2,2],[2,3]]);
    const res = gb.receiveAttack([0,0]);
    expect(res.result).toBe('miss');
    expect(gb.getMisses()).toEqual([[0,0]]);
  });

  test('receiveAttack returns repeat for same miss coordinate', () => {
    const gb = createGameboard();
    gb.placeShip(1, [[3,3]]);
    expect(gb.receiveAttack([0,0]).result).toBe('miss');
    expect(gb.receiveAttack([0,0]).result).toBe('repeat');
  });

  test('allSunk reports true only when all ships sunk', () => {
    const gb = createGameboard();
    gb.placeShip(1, [[4,4]]);
    gb.placeShip(2, [[5,5],[5,6]]);
    expect(gb.allSunk()).toBe(false);
    gb.receiveAttack([4,4]);
    expect(gb.allSunk()).toBe(false);
    gb.receiveAttack([5,5]);
    gb.receiveAttack([5,6]);
    expect(gb.allSunk()).toBe(true);
  });
});
