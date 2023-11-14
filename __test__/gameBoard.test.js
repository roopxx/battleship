import { GameBoard } from "../src/gameBoard";
import { Ship } from "../src/ship";

let gameBoard, shipX, shipY;

beforeEach(() => {
  shipX = new Ship(3, "horizontal");
  shipY = new Ship(5, "vertical");
  gameBoard = new GameBoard();
});

describe("gameBoard generation", () => {
  test("gameBoard class creates an object", () => {
    expect(gameBoard).toBeDefined();
  });

  test("gameBoard has board", () => {
    expect(gameBoard.board).toBeDefined();
  });

  test("gameBoard has 10 rows", () => {
    expect(gameBoard.board).toHaveLength(10);
  });

  test("Each gameBoard row has 10 cells", () => {
    expect(gameBoard.board[0]).toHaveLength(10);
    expect(gameBoard.board[3]).toHaveLength(10);
    expect(gameBoard.board[9]).toHaveLength(10);
  });

  test("Each gameBoard includes correct cells", () => {
    expect(gameBoard.board[0][5].coordinates).toEqual([0, 5]);
    expect(gameBoard.board[2][9].coordinates).toEqual([2, 9]);
    expect(gameBoard.board[8][0].coordinates).toEqual([8, 0]);
  });
});

describe("GameBoard places ships.", () => {
  test("GameBoard allows placement of ship within bounds", () => {
    expect(gameBoard.checkPlacement(shipX, [3, 4])).toBeTruthy();
    expect(gameBoard.checkPlacement(shipX, [7, 8])).toBeFalsy();
  });

  test("GameBoard doesn't allow placement of ship out of boundaries", () => {
    expect(gameBoard.checkPlacement(shipY, [3, 4])).toBeTruthy();
    expect(gameBoard.checkPlacement(shipY, [6, 8])).toBeFalsy();
  });

  test("GameBoard places ships horizontally along X-axis", () => {
    gameBoard.placeShip(shipX, [3, 5]);
    expect(gameBoard.board[3][4].hasShip).toBe(false);
    expect(gameBoard.board[3][5].hasShip).toBe(true);
    expect(gameBoard.board[3][6].hasShip).toBe(true);
    expect(gameBoard.board[3][7].hasShip).toBe(true);
    expect(gameBoard.board[3][8].hasShip).toBe(false);
  });

  test("GameBoard places ships vertically along Y-axis", () => {
    gameBoard.placeShip(shipY, [3, 5]);
    expect(gameBoard.board[2][5].hasShip).toBe(false);
    expect(gameBoard.board[3][5].hasShip).toBe(true);
    expect(gameBoard.board[4][5].hasShip).toBe(true);
    expect(gameBoard.board[5][5].hasShip).toBe(true);
    expect(gameBoard.board[6][5].hasShip).toBe(true);
    expect(gameBoard.board[7][5].hasShip).toBe(true);
    expect(gameBoard.board[8][5].hasShip).toBe(false);
  });

  test("GameBoard don't allow placement of ships overlapping on each other", () => {
    gameBoard.placeShip(shipX, [4, 5]);
    expect(gameBoard.placeShip(shipY, [3, 6])).toBe(
      "There is an issue with placing the ship on the board, as it may be outside the boundaries or overlapping with another ship."
    );
  });

  test("GameBoard places ship and add ship to ships list", () => {
    gameBoard.placeShip(shipX, [1, 5]);
    gameBoard.placeShip(shipX, [3, 2]);
    gameBoard.placeShip(shipY, [2, 1]);
    gameBoard.placeShip(shipY, [5, 4]);
    expect(gameBoard.ships).toHaveLength(4);
  });

  test("GameBoard generates ships from a input array of ship length and place them on random X and Y coordinates", () => {
    gameBoard.generateRandomShipsXY([2, 3, 4, 5, 5]);
    expect(gameBoard.ships).toHaveLength(5);
  });
});

describe("GameBoard receives attack.", () => {
  beforeEach(() => {
    gameBoard.placeShip(shipX, [9, 2]);
    gameBoard.placeShip(shipY, [1, 8]);
  });

  test("GameBoard receives hit unsuccessfully", () => {
    expect(gameBoard.receiveAttack([0, 0])).toEqual([false, [0, 0], false]);
  });

  test("GameBoard receives hit successfully", () => {
    expect(gameBoard.receiveAttack([9, 3])).toEqual([true, [9, 3], false]);
  });

  test("GameBoard receives hit successfully and sink a ship", () => {
    expect(gameBoard.receiveAttack([9, 2])).toEqual([true, [9, 2], false]);
    expect(gameBoard.receiveAttack([9, 3])).toEqual([true, [9, 3], false]);
    expect(gameBoard.receiveAttack([9, 4])).toEqual([true, [9, 4], true]);
  });

  test("GameBoard cannot receive duplicate attack", () => {
    expect(gameBoard.receiveAttack([9, 2])).toEqual([true, [9, 2], false]);
    expect(gameBoard.receiveAttack([9, 2])).toEqual(
      "Cannot attack on same coordinates!"
    );
  });
});

describe("GameBoard gets ships data a.k.a ship sunk and ships remaining", () => {
  beforeEach(() => {
    gameBoard.placeShip(shipX, [0, 0]);
    gameBoard.placeShip(shipY, [1, 0]);
  });

  test("GameBoard gets the remaining ships", () => {
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    gameBoard.receiveAttack([0, 2]);
    expect(gameBoard.remainingShips).toBe(1);
  });

  test("GameBoard gets has all the ships sunk data", () => {
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    gameBoard.receiveAttack([0, 2]);
    gameBoard.receiveAttack([1, 0]);
    gameBoard.receiveAttack([2, 0]);
    gameBoard.receiveAttack([3, 0]);
    gameBoard.receiveAttack([4, 0]);
    gameBoard.receiveAttack([5, 0]);
    expect(gameBoard.allShipsSunk).toBeTruthy();
  });

  test("GameBoard gets has all the ships sunk data", () => {
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    gameBoard.receiveAttack([0, 2]);
    expect(gameBoard.allShipsSunk).toBeFalsy();
  });
});
