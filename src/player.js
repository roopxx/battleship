import { GameBoard } from "./gameBoard.js";

// Player class representing a player with a name, a battlefield, turn status, and move history
class Player {
  // Constructor for creating a player with a specified name and turn status
  constructor(name, myTurn = false) {
    this.name = name; // Player's name
    this.battlefield = new GameBoard(name); // Player's game board
    this.myTurn = myTurn; // Player's turn status
    this.previousMoves = new Set(); // Set to keep track of previous moves
    this.isComputer = false; // Flag to identify if the player is a computer or human
    this.opponent = null; // Reference to the opponent player
    this.targetStack = []; // Stack to store computer's target moves
  }

  // Method for a player to attack the opponent at specified coordinates
  attackOpponent(coordinates) {
    // Check if it's the player's turn
    if (this.myTurn === false) {
      return "Not your turn!!!";
    }

    // Extract coordinates
    const [attackX, attackY] = coordinates;

    // Check if the attack is within the boundaries of the opponent's board
    const dimension = this.battlefield.board.length;
    if (
      attackX < 0 ||
      attackX >= dimension ||
      attackY < 0 ||
      attackY >= dimension
    ) {
      return "Your attack is out of boundaries";
    }

    // Check if the target cell has been attacked before
    if (
      this.opponent.battlefield.board[attackX][attackY].beenAttacked === true
    ) {
      this.myTurn = true;
      this.opponent.myTurn = false;
      return "Duplicate attack";
    }

    // Perform the attack on the opponent's board
    const [successHit, [hitX, hitY], sunk] =
      this.opponent.battlefield.receiveAttack(coordinates);

    // Check if the attacked ship is sunk
    if (sunk === true) {
      this.myTurn = true;
      this.opponent.myTurn = false;
      return [successHit, [hitX, hitY], sunk];
    }

    // Switch turns
    this.myTurn = false;
    this.opponent.myTurn = true;
    return [successHit, [hitX, hitY], sunk];
  }

  // Method for computer player to make a move
  computerMove() {
    let randomXY;

    // Check if the computer player has a target stack
    if (this.targetStack.length === 0) {
      this.previousAttack = false;
    }

    // Generate a random move if no previous attack or choose from the target stack
    if (!this.previousAttack) {
      do {
        const X = Math.floor(Math.random() * 10);
        const Y = Math.floor(Math.random() * 10);
        randomXY = [X, Y];
      } while (this.previousMoves.has(randomXY.toString()));
    } else {
      do {
        this.targetStack = this.targetStack.filter(
          (item) => ![...this.previousMoves].includes(item)
        );
        randomXY = this.targetStack.pop();
      } while (this.previousMoves.has(randomXY.toString()));
    }

    // Store the unique move in the previousMoves set
    this.previousMoves.add(randomXY.toString());

    // Perform the attack and return the result
    return this.attackOpponent(randomXY);
  }

  // Getter method to get the total number of moves made by the player
  get totalMoves() {
    // Flatten the opponent's board and filter attacked cells
    const cells = this.opponent.battlefield.board.flat();
    const attackedCells = cells.filter((cell) => cell.beenAttacked === true);

    // Return the total number of attacked cells
    return attackedCells.length;
  }
}

// Export the Player class for use in other modules
export { Player };
