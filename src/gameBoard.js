import { Ship } from "./ship.js";
import fireSound from "./audio/Blast.mp3";
import splashSound from "./audio/Watersplash.mp3";

// Cell on board class
class Cell {
  constructor(x, y) {
    this.coordinates = [x, y];
    this.hasShip = false;
    this.beenAttacked = false;
  }
}

// Player's board
class GameBoard {
  constructor(name, dimensions = 10) {
    this.name = name;
    this.board = this.generateBattleField(dimensions);
    this.missedShots = [];
    this.ships = [];
  }

  // Generate a 2D array representing the game board
  generateBattleField(dimensions) {
    const board = new Array(dimensions)
      .fill(null)
      .map(() => new Array(dimensions).fill(null));

    // Fill the array with objects containing their Cell coordinates
    board.forEach((row, i) => {
      row.forEach((column, j) => {
        board[i][j] = new Cell(i, j);
      });
    });

    return board;
  }

  // Generate random coordinates for placing ships on the board
  generateRandomShipsXY(shipList) {
    for (let i = 0; i < shipList.length; i++) {
      let ship;
      let randCoordinates;
      let checkPlacementResult;
      let randomDirection;

      do {
        ship = new Ship(shipList[i]);
        randomDirection = ["horizontal", "vertical"][
          Math.floor(Math.random() * 2)
        ];
        randCoordinates = [
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ];
        ship.direction = randomDirection;
        checkPlacementResult = this.checkPlacement(ship, randCoordinates);
      } while (checkPlacementResult == false);

      this.placeShip(ship, randCoordinates);
    }
  }

  // Place a ship on the board
  placeShip(ship, coordinates) {
    let [x, y] = coordinates;
    let shipLength = ship.length;
    let board = this.board;
    let shipDirection = ship.direction;
    let id = ship.shipName;

    // Check if ship fits on the board
    if (this.checkPlacement(ship, coordinates) == false) {
      return "There is an issue with placing the ship on the board, as it may be outside the boundaries or overlapping with another ship.";
    }

    // If the ship is horizontal, place it along x
    if (shipDirection == "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        board[x][y + i].hasShip = true;
        board[x][y + i].shipName = id;
      }
    } else {
      // Place it along y
      for (let i = 0; i < shipLength; i++) {
        board[x + i][y].hasShip = true;
        board[x + i][y].shipName = id;
      }
    }
    this.ships.push(ship);
    return board;
  }

  // Check if a ship can be placed at the specified coordinates
  checkPlacement(ship, coordinates) {
    let [x, y] = coordinates;
    let shipDirection = ship.direction;
    let shipLength = ship.length;
    let board = this.board;
    let boardBoundaries = board.length;

    // Check if boundaries are not extending
    if (shipDirection == "horizontal") {
      if (y + shipLength > boardBoundaries) return false;

      // Check if another ship is already in place
      for (let i = y; i < y + shipLength; i++) {
        if (board[x][i].hasShip === true) return false;
      }
    } else {
      if (x + shipLength > boardBoundaries) return false;

      for (let i = x; i < x + shipLength; i++) {
        if (board[i][y].hasShip === true) return false;
      }
    }
    return true;
  }

  // Receive an attack on the specified coordinates
  receiveAttack(coordinates) {
    const [x, y] = coordinates;
    let cellAttacked = this.board[x][y];
    let hitShip = {};
    let sunk = false;
    let successHit = false;

    let success_attack_sound = new Audio(fireSound);
    let fail_attack_sound = new Audio(splashSound);

    if (cellAttacked.beenAttacked) {
      // Handling same coordinates attacks
      return "Cannot attack on the same coordinates!";
    } else {
      cellAttacked.beenAttacked = true;
    }

    if (cellAttacked.hasShip) {
      // If successful hit on ship
      hitShip = this.ships.find(
        (ship) => ship.shipName === cellAttacked.shipName
      );
      hitShip.hit();
      successHit = true;
      success_attack_sound.play();
      if (hitShip.sunk === true) {
        sunk = true;
      }
    } else {
      fail_attack_sound.play();
    }

    this.renderAttackOnBoard([x, y], successHit, sunk, hitShip);
    this.allShipsSunk; // Check if ship is sunk after each new attack
    return [successHit, [x, y], sunk];
  }

  // Figure out how to render attacks on the board ***TODO***
  renderAttackOnBoard(coordinates, hitWasSuccess, sunk, ship) {
    const domCell = document.querySelector(
      `#${this.name.toLowerCase()} [data-coordinates='${coordinates.toString()}']`
    );
    domCell.classList.add("attacked");

    if (hitWasSuccess) {
      domCell.classList.add("has-ship");
      console.log(domCell);
      domCell.dataset.ship = ship.shipName;
    }

    // Add cascading explosion animation when the ship is sunk
    if (sunk) {
      const shipCells = document.querySelectorAll(
        `[data-ship='${ship.shipName}']`
      );
      let delay = 0;
      shipCells.forEach((cell) => {
        setTimeout(() => {
          cell.classList.add("sunk");
        }, delay);
        delay += 100;
      });
    }

    const ships = document.querySelector(
      `#${this.name.toLowerCase()} li.ships`
    );
    ships.textContent = `${
      this.name === "You" ? "Your" : "Computer's"
    } ships: ${this.remainingShips}`;
  }

  // Get the remaining number of ships that are not sunk
  get remainingShips() {
    return this.ships.filter((ship) => !ship.sunk).length;
  }

  // Check if all ships are sunk
  get allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export { GameBoard, Cell };
