const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let snake = [];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let gameInterval;
let isGameRunning = false;

function initGame() {
  // Initial snake position
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  score = 0;
  // Initial movement direction (right)
  dx = 1;
  dy = 0;

  scoreElement.textContent = score;
  createFood();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
  isGameRunning = true;
  startBtn.textContent = "重新开始";
  startBtn.blur(); // Remove focus so space/enter doesn't trigger it again
}

function gameLoop() {
  if (!isGameRunning) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check Game Over conditions before moving
  if (checkCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    createFood();
    // Don't pop the tail, so the snake grows
  } else {
    snake.pop(); // Remove tail
  }

  drawGame();
}

function drawGame() {
  clearCanvas();
  drawFood();
  drawSnake();
}

function clearCanvas() {
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    // Head is darker green
    if (index === 0) ctx.fillStyle = "#006400";
    else ctx.fillStyle = "green";

    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    );
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2,
  );
}

function createFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  // Check if food spawns on snake body
  snake.forEach((part) => {
    if (part.x === food.x && part.y === food.y) {
      createFood();
    }
  });
}

function checkCollision(head) {
  // Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return true;
  }

  // Self collision
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  alert(`游戏结束! 你的得分是: ${score}`);
  startBtn.textContent = "开始游戏";
}

document.addEventListener("keydown", keyDownEvent);

function keyDownEvent(event) {
  // Prevent default scrolling for arrow keys
  if (
    ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(event.key) > -1
  ) {
    event.preventDefault();
  }

  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (event.key === "ArrowLeft" && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (event.key === "ArrowUp" && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (event.key === "ArrowRight" && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (event.key === "ArrowDown" && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

startBtn.addEventListener("click", initGame);
