const startBtn = document.getElementById("start-btn");
const basket = document.getElementById("basket");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");
const gameMessage = document.getElementById("game-message");

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let basketX = 310;
const basketSpeed = 15;
let bottleSpawnRate = 1200;
let bottleFallSpeed = 3;
let spawnInterval;
let gameLoopInterval;
let keys = {};

// Keyboard controls
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Mouse controls
gameArea.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  basketX = Math.max(0, Math.min(mouseX - 40, gameArea.clientWidth - 80));
  basket.style.left = basketX + "px";
});

// Touch controls for mobile
gameArea.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  e.preventDefault();
  const rect = gameArea.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;
  basketX = Math.max(0, Math.min(touchX - 40, gameArea.clientWidth - 80));
  basket.style.left = basketX + "px";
});

function moveBasket() {
  if (keys["ArrowLeft"] || keys["a"]) {
    basketX = Math.max(0, basketX - basketSpeed);
  }
  if (keys["ArrowRight"] || keys["d"]) {
    basketX = Math.min(gameArea.clientWidth - 80, basketX + basketSpeed);
  }
  basket.style.left = basketX + "px";
}

function createBottle() {
  if (!gameRunning) return;

  const bottle = document.createElement("div");
  bottle.className = "bottle";
  const randomX = Math.random() * (gameArea.clientWidth - 35);
  bottle.style.left = randomX + "px";
  bottle.style.top = "-60px";
  bottle.setAttribute("data-x", randomX);
  bottle.setAttribute("data-y", -60);

  gameArea.appendChild(bottle);
}

function updateBottles() {
  const bottles = document.querySelectorAll(".bottle");
  const basketLeft = basketX;
  const basketRight = basketX + 80;
  const basketTop = gameArea.clientHeight - 50;

  bottles.forEach((bottle) => {
    let y = parseFloat(bottle.getAttribute("data-y"));
    let x = parseFloat(bottle.getAttribute("data-x"));

    y += bottleFallSpeed;
    bottle.style.top = y + "px";
    bottle.setAttribute("data-y", y);

    // Check if bottle is caught
    if (
      y + 60 >= basketTop &&
      y <= gameArea.clientHeight &&
      x + 35 >= basketLeft &&
      x <= basketRight
    ) {
      score += 10 * level;
      scoreDisplay.textContent = score;
      bottle.remove();
      updateLevel();
    }

    // Check if bottle missed (hit ground)
    if (y > gameArea.clientHeight) {
      lives--;
      livesDisplay.textContent = lives;
      bottle.remove();

      if (lives <= 0) {
        endGame();
      }
    }
  });
}

function updateLevel() {
  const newLevel = Math.floor(score / 100) + 1;
  if (newLevel > level) {
    level = newLevel;
    levelDisplay.textContent = level;
    bottleSpawnRate = Math.max(600, 1200 - level * 100);
    bottleFallSpeed = 3 + level * 0.5;
    gameMessage.textContent = `Level Up! 🎉 Now Level ${level}`;
    gameMessage.classList.add("game-won");
    setTimeout(() => {
      gameMessage.classList.remove("game-won");
      gameMessage.textContent = "";
    }, 2000);
  }
}

function startGame() {
  if (gameRunning) return;

  score = 0;
  lives = 3;
  level = 1;
  gameRunning = true;
  bottleSpawnRate = 1200;
  bottleFallSpeed = 3;

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  levelDisplay.textContent = level;
  gameMessage.textContent = "Game Started! Use Arrow Keys or Mouse to move.";
  gameMessage.classList.remove("game-over", "game-won");

  basket.style.display = "block";

  // Clear any existing bottles
  document.querySelectorAll(".bottle").forEach((b) => b.remove());

  spawnInterval = setInterval(createBottle, bottleSpawnRate);

  gameLoopInterval = setInterval(() => {
    moveBasket();
    updateBottles();
  }, 30);
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(gameLoopInterval);
  gameRunning = false;

  gameMessage.textContent = `Game Over! Final Score: ${score} | Level: ${level}`;
  gameMessage.classList.add("game-over");

  setTimeout(() => {
    alert(`Game Over!\n\nFinal Score: ${score}\nLevel Reached: ${level}\n\nClick Start Game to play again!`);
  }, 300);
}

startBtn.addEventListener("click", startGame);
