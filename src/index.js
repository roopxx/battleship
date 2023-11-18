import { Game } from "./game";

import "./style.css";

// Create a new game instance
let game = new Game();

// Function to render the start page
function renderStartPage() {
  const main = document.querySelector("#main");
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  wrapper.innerHTML = `
    <div class="bg"></div>
    <div class="lightning flashit"></div>
`;

  const header = document.createElement("header");
  header.classList.add("header");
  header.textContent = "BATTLESHIP";

  const button = document.createElement("button");
  button.classList.add("startGameBtn");
  button.textContent = "START GAME";

  // Event listener for starting the game
  button.addEventListener("click", (event) => {
    // Generate random ships for both players
    game.playerOne.battlefield.generateRandomShipsXY([6, 5, 4, 3, 2]);
    game.playerTwo.battlefield.generateRandomShipsXY([6, 5, 4, 3, 2]);

    // Start the game
    game.playGame();

    // Render the game interface
    renderGame();
  });

  wrapper.append(header, button);
  main.append(wrapper);
}

// Function to render the game interface
function renderGame() {
  const wrapper = document.querySelector(".wrapper");

  // Clear the existing content of the wrapper
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  wrapper.classList.add("battlefield-wrapper");

  // Render the game header
  const header = document.createElement("header");
  header.classList.add("board-header");
  header.innerHTML = `
  <div class="main">
    <span>B</span>
    <span>A</span>
    <span>T</span>
    <span>T</span>
    <span>L</span>
    <span>E</span>
    <span class="letter"></span>
    <span>S</span>
    <span>H</span>
    <span>I</span>
    <span>P</span>
  </div>`;

  // Render player boards and game modal
  const playerOneBoard = renderPlayerBoard(game.playerOne);
  const playerTwoBoard = renderPlayerBoard(game.playerTwo);
  const modal = renderModal();

  wrapper.append(header, playerOneBoard, playerTwoBoard, modal);
}

// Function to render the game-over modal
function renderModal() {
  const modal = document.createElement("dialog");
  modal.setAttribute("id", "game-over-modal");

  const gameOver = document.createElement("h2");
  gameOver.textContent = "Game Over!";

  const newGameButton = document.createElement("button");
  newGameButton.setAttribute("id", "new-game-button");
  newGameButton.textContent = "New Game";

  // Event listener for starting a new game
  newGameButton.addEventListener("click", (event) => {
    // Close the modal
    const modal = document.querySelector("#game-over-modal");

    // Create a new game instance
    game = new Game();

    // Generate random ships for both players
    game.playerOne.battlefield.generateRandomShipsXY([6, 5, 4, 3, 2]);
    game.playerTwo.battlefield.generateRandomShipsXY([6, 5, 4, 3, 2]);

    // Start the new game
    game.playGame();
    renderGame();
  });

  const winnerText = document.createElement("h3");
  winnerText.setAttribute("id", "winner-text");

  modal.append(gameOver, newGameButton, winnerText);

  return modal;
}

// Function to render the player's board
function renderPlayerBoard(player) {
  const block = document.createElement("div");
  block.setAttribute("class", "block");
  block.setAttribute(
    "id",
    player.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  );

  const playerName = document.createElement("h2");
  playerName.textContent = player.name;

  const board = document.createElement("div");
  board.setAttribute("class", "board");

  const dimensions = player.battlefield.board.length;

  // Loop through the board cells and render them
  for (let i = 0; i < dimensions; i += 1) {
    for (let j = 0; j < dimensions; j += 1) {
      const cellReference = player.battlefield.board[i][j];

      const cellElement = document.createElement("div");
      cellElement.setAttribute("class", "cell");
      cellElement.dataset.coordinates = `${i},${j}`;

      // Render ships on the player's board (only for human player)
      if (player.isComputer === false) {
        if (cellReference.hasShip) {
          cellElement.classList.add("has-ship");
          cellElement.dataset.ship = cellReference.shipName;
        }
      }

      // Add click event listener for computer player's board
      if (player.isComputer === true) {
        cellElement.addEventListener("click", (e) => {
          player.opponent.attackOpponent([i, j]);
        });
      }

      board.append(cellElement);
    }
  }

  const details = document.createElement("ul");
  details.setAttribute("class", "details");

  // Render details (remaining ships) for the player
  const ships = document.createElement("li");
  ships.setAttribute("class", "ships");
  ships.textContent = `${
    player.name === "You" ? "Your" : "Computer's"
  } ships: ${player.battlefield.remainingShips}`;

  details.append(ships);

  block.append(playerName, board, details);
  return block;
}

// Render the start page when the script is executed
renderStartPage();
