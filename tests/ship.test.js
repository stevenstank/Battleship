const createShip = require('../src/ship');

describe('Ship factory public interface', () => {
  test('creates a ship with given length and hits start at 0', () => {
    const ship = createShip(3);
    expect(ship.length).toBe(3);
    expect(ship.getHits()).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  test('hit() increments hits and getHits reports it', () => {
    const ship = createShip(2);
    ship.hit();
    expect(ship.getHits()).toBe(1);
    ship.hit();
    expect(ship.getHits()).toBe(2);
  });

  test('isSunk returns true when hits reach length', () => {
    const ship = createShip(2);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('hit() does not increase hits beyond length', () => {
    const ship = createShip(1);
    ship.hit();
    ship.hit();
    expect(ship.getHits()).toBe(1);
    expect(ship.isSunk()).toBe(true);
  });

  test('invalid lengths throw', () => {
    expect(() => createShip(0)).toThrow();
    expect(() => createShip(-1)).toThrow();
    expect(() => createShip(1.5)).toThrow();
  });
});
