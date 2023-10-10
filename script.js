"use strict";

// ---Issues to fix---
// Snake can sometimes turn back into itself.
// When starting a new game, changing difficulty messes up the speed of the game.

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

// Game switch
let gameOver = false;
let gameStart = false;
let gameLoaded = false;
let changeDirection = false;

// Scores
let score = 0;
let highScore = 0;

// Food Properties
let foodX;
let foodY;

// Canvas Properties
let boxSize = 10;
let columns = 50;
let rows = 50;

// Snake Properties
let snakeX = boxSize * 25;
let snakeY = boxSize * 25;
let moveX = 0;
let moveY = 0;

let snakeArr = [];

// Set Difficulty Levels
let easyMode = 100;
let hardMode = 50;
let insaneMode = 25;
let gameDifficulty = easyMode;

// Button Events
document.querySelector("#easy_mode").addEventListener("click", function () {
  if (gameDifficulty != easyMode) {
    gameDifficulty = easyMode;
    snakeX = boxSize * 25;
    snakeY = boxSize * 25;
    gameLoaded = false;
    loadGame();
    changeInstructions();
  }
});

document.querySelector("#hard_mode").addEventListener("click", function () {
  if (gameDifficulty != hardMode) {
    gameDifficulty = hardMode;
    snakeX = boxSize * 25;
    snakeY = boxSize * 25;
    gameLoaded = false;
    loadGame();
    changeInstructions();
  }
});

document.querySelector("#insane_mode").addEventListener("click", function () {
  if (gameDifficulty != insaneMode) {
    gameDifficulty = insaneMode;
    snakeX = boxSize * 25;
    snakeY = boxSize * 25;
    gameLoaded = false;
    loadGame();
    changeInstructions();
  }
});

document.querySelector(".new-game").addEventListener("click", function () {
  if (gameOver) {
    gameStart = false;
    document.querySelector(".score").innerHTML = "Score: 0";
    document.querySelector(".instructions").innerHTML =
      "Press Arrow Key to start!";
    snakeX = boxSize * 25;
    snakeY = boxSize * 25;
    moveX = 0;
    moveY = 0;
    score = 0;
    gameOver = false;
    snakeArr = [];
    startFood();
    reload();
  }
});

// Load Game
function loadGame() {
  if (!gameLoaded) {
    canvas.height = boxSize * rows;
    canvas.width = boxSize * columns;

    startFood();
    document.addEventListener("keydown", moveSnake);
    setInterval(reload, gameDifficulty);
    gameLoaded = true;
  }
}

window.onload = document.addEventListener("DOMContentLoaded", loadGame);

function reload() {
  if (gameStart) {
    changeInstructions();
  }

  if (gameOver) {
    return;
  }
  gameEnded();
  changeDirection = false;
  // Game Board
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(foodX, foodY, boxSize, boxSize);
  // Snake
  ctx.fillStyle = "rgb(187, 211, 5)";
  snakeX = snakeX + moveX * boxSize;
  snakeY = snakeY + moveY * boxSize;
  ctx.fillRect(snakeX, snakeY, boxSize, boxSize);
  eatFood();
  growSnake();
}

// Move Snake
function moveSnake(e) {
  if (!changeDirection) {
    changeDirection = true;
    if (e.key === "ArrowRight" && moveX != -1) {
      moveX = 1;
      moveY = 0;
      gameStart = true;
    } else if (e.key === "ArrowLeft" && moveX != 1) {
      moveX = -1;
      moveY = 0;
      gameStart = true;
    } else if (e.key === "ArrowUp" && moveY != 1) {
      moveX = 0;
      moveY = -1;
      gameStart = true;
    } else if (e.key === "ArrowDown" && moveY != -1) {
      moveX = 0;
      moveY = 1;
      gameStart = true;
    }
  }
}

// Place Food
function startFood() {
  const randomRow = Math.floor(Math.random() * rows);
  const randomColumn = Math.floor(Math.random() * columns);
  foodX = boxSize * randomRow;
  foodY = boxSize * randomColumn;

  if (foodX == snakeX && foodY == snakeY) {
    startFood();
    return;
  }
}

// Eat Food
function eatFood() {
  if (snakeX == foodX && snakeY == foodY) {
    score++;
    snakeArr.push([foodX, foodY]);
    addScore();
    startFood();
  }
}

// Grow Snake
function growSnake() {
  for (let i = 0; i < snakeArr.length; i++) {
    ctx.fillStyle = "rgb(187, 211, 5)";
    ctx.fillRect(snakeArr[i][0], snakeArr[i][1], boxSize, boxSize);
  }
  for (let i = snakeArr.length - 1; i > 0; i--) {
    snakeArr[i] = snakeArr[i - 1];
  }
  if (snakeArr.length) {
    snakeArr[0] = [snakeX, snakeY];
  }
}

// Update Score
function addScore() {
  document.querySelector(".score").innerHTML = "Score: " + score;
}

// Game Over
function gameEnded() {
  if (
    snakeX < 0 ||
    snakeX >= columns * boxSize ||
    snakeY < 0 ||
    snakeY >= rows * boxSize
  ) {
    gameOver = true;
    alert("Game Over");
    checkHighScore();
  }
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeX == snakeArr[i][0] && snakeY == snakeArr[i][1]) {
      gameOver = true;
      alert("Game Over");
      checkHighScore();
    }
  }
}

// Update High Score
function checkHighScore() {
  if (gameOver == true && score > highScore) {
    highScore = score;
    document.querySelector(".high-score").innerHTML =
      "High Score: " + highScore;
    alert(`You set a new High Score of ${highScore}!`);
  }
}

// Change Instructions
function changeInstructions() {
  let difficultyString = Object.keys({ easyMode, hardMode, insaneMode }).find(
    (key) => eval(key) === gameDifficulty
  );
  difficultyString =
    difficultyString.charAt(0).toUpperCase() + difficultyString.slice(1);
  difficultyString =
    difficultyString.slice(0, -4) + " " + difficultyString.slice(-4);
  document.querySelector(".instructions").innerHTML = difficultyString;
}
