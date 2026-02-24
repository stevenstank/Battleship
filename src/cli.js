const readline = require('readline');
const createGameboard = require('./gameboard');
const createPlayer = require('./player');

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function placeRandomShips(gameboard, shipLengths = [3, 2, 2, 1, 1], boardSize = 5) {
  for (const length of shipLengths) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 500) {
      const horizontal = Math.random() < 0.5;
      const r = randInt(boardSize - (horizontal ? 0 : length - 1));
      const c = randInt(boardSize - (horizontal ? length - 1 : 0));
      const coords = [];
      for (let i = 0; i < length; i++) coords.push([r + (horizontal ? 0 : i), c + (horizontal ? i : 0)]);
      try {
        gameboard.placeShip(length, coords);
        placed = true;
      } catch (e) {
        attempts += 1;
      }
    }
    if (!placed) throw new Error('failed to place ships');
  }
}

function printBoardSummary(gameboard, boardSize = 5) {
  const misses = new Set(gameboard.getMisses().map((p) => `${p[0]},${p[1]}`));
  const ships = gameboard.getShips();
  const hitSet = new Set();
  for (const s of ships) {
    const ship = s.ship;
    const positions = s.positions;
    for (let i = 0; i < positions.length; i++) {
      if (ship.getHits() > 0) hitSet.add(positions[i]);
    }
  }
  console.log('Misses:', Array.from(misses));
}

async function runCLI() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise((res) => rl.question(q, res));

  const boardSize = 5;
  const human = createPlayer('human', createGameboard);
  const computer = createPlayer('computer', createGameboard);

  placeRandomShips(human.gameboard, [3, 2, 1], boardSize);
  placeRandomShips(computer.gameboard, [3, 2, 1], boardSize);

  console.log('Welcome to Battleship (CLI). Enter coordinates as row,col (e.g. 0,0).');

  let current = human;
  while (true) {
    if (current === human) {
      const ans = await question('Your move: ');
      const parts = ans.split(',').map((s) => Number(s.trim()));
      if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
        console.log('Invalid input. Use row,col');
        continue;
      }
      if (parts.some((n) => n < 0)) {
        console.log('Negative coordinates not allowed');
        continue;
      }
      if (parts.some((n) => n >= boardSize)) {
        console.log(`Note: coordinate outside ${boardSize}x${boardSize} grid — treated as miss if no ship.`);
      }
      const res = human.attack(computer.gameboard, parts);
      console.log('Result:', res.result);
      if (computer.gameboard.allSunk()) {
        console.log('You win!');
        break;
      }
      current = computer;
    } else {
      const res = computer.randomAttack(human.gameboard, boardSize);
      console.log('Computer attacks:', res.result);
      if (human.gameboard.allSunk()) {
        console.log('Computer wins!');
        break;
      }
      current = human;
    }
  }

  rl.close();
}

if (require.main === module) runCLI().catch((e) => { console.error(e); process.exit(1); });
