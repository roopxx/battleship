import { Player } from "./player.js";
import sound from "./audio/Battleship-MainTheme.mp3";

// Game class for managing the gameplay between two players
class Game {
  // Constructor for initializing the game with two players and game status
  constructor() {
    // Create two players: human player (You) and computer player
    this.playerOne = new Player("You", true);
    this.playerTwo = new Player("Computer");

    // Game status flag
    this.gameOver = false;

    // Create an audio player for the game theme
    this.battleShipTheme = new Audio(sound);

    // Set player references for opponents
    this.playerOne.opponent = this.playerTwo;
    this.playerTwo.opponent = this.playerOne;

    // Set computer player flag
    this.playerTwo.isComputer = true;
  }

  // Method to start the game and listen for player clicks
  playGame() {
    this.battleShipTheme.play();
    document.addEventListener("click", () => {
      if (!this.gameOver) {
        this.playTurn();
      }
    });
  }

  // Method to manage a single turn in the game
  playTurn() {
    const human = this.playerOne;
    const computer = this.playerTwo;

    // Check the game status before proceeding with the turn
    this.checkGameStatus();

    // If the game is not over
    if (!this.gameOver) {
      // If it's the computer's turn
      if (computer.myTurn) {
        setTimeout(() => {
          // Perform a move for the computer player
          let [successHit, [x, y], sunk] = computer.computerMove();

          // If the computer successfully hit a ship, update target stack for subsequent moves
          if (successHit) {
            this.playerTwo.previousAttack = true;
            let offSets = [
              [0, 1],
              [1, 0],
              [0, -1],
              [-1, 0],
            ];

            for (const offSet of offSets) {
              let [i, j] = offSet;
              let nextAttack = [x + i, y + j];
              if (
                nextAttack[0] >= 0 &&
                nextAttack[0] < 10 &&
                nextAttack[1] >= 0 &&
                nextAttack[1] < 10 &&
                !this.playerTwo.previousMoves.has(nextAttack.toString())
              ) {
                this.playerTwo.targetStack.push(nextAttack);
              }
            }
          }

          // Check the game status again after the turn
          this.checkGameStatus();
        }, 1750); //  milliseconds delay for better user experience
      }
    }
  }

  // Method to check if the game has ended
  checkGameStatus() {
    const human = this.playerOne;
    const computer = this.playerTwo;

    // Check if the computer's fleet is sunk
    if (computer.battlefield.allShipsSunk) {
      this.gameOver = true;
      this.announceGameOver(human);
    }
    // Check if the human's fleet is sunk
    else if (human.battlefield.allShipsSunk) {
      this.gameOver = true;
      this.announceGameOver(computer);
    }
  }

  // Method to display a modal announcing the winner and game statistics
  announceGameOver(winner) {
    setTimeout(() => {
      const modal = document.querySelector("#game-over-modal");
      modal.style.display = "flex";
      const winnerText = document.querySelector("#winner-text");
      winnerText.innerHTML = `${winner.name} won in ${winner.totalMoves} moves </br> with ${winner.battlefield.remainingShips} remaining ships.`;

      modal.showModal();
    }, 500);
  }
}

// Export the Game class for use in other modules
export { Game };
