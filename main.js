// ---------- Game settings ----------
tick_period = 66;
board_dimension = 50;
max_mushrooms = 3;
mushroom_score = 25;
tick_score = 0.1;
mushroom_frequency = 20;
min_mushroom_life = 50;
mushroom_growth_delta = 0.1;
initial_snake_length = 5;
snake_grows_after_ticks = 10;
segments_added_per_mushroom = 10;

var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 10);

function init() {
  var startButton = document.getElementById('startButton');
  scoreboard = new Scoreboard();
  scoreboard.render();
  registerEventHandler(startButton, 'click', function() { start(); });
}

function start() {
  stop();
  document.getElementById('overlay').style.display = 'none';
  playField = new PlayField(board_dimension, board_dimension);
  snake = new Snake(initial_snake_length);
  keyboardController = new KeyboardController();
  retroCanvas = new RetroCanvas(document.getElementById('game'), playField.width, playField.height);
  ticks = 0;
  score = -1;
  updateScore(0);
  gameOver = false;
  ticker = setInterval(function() {
    tick();
  }, tick_period);
}

function stop() {
  if (typeof(ticker) != 'undefined') {
    clearInterval(ticker);
  }
}

function tick() {
  ticks++;
  if (snake.alive) {
    updateScore(score + tick_score);
    snake.move();
  }
  playField.update();
  playField.draw();
  snake.draw();
  if (!gameOver && !snake.alive) {
    gameOver = true;
    scoreboard.addScore(Math.floor(score));
    scoreboard.render();
    document.getElementById('startButton').innerHTML = 'Play Again';
    document.getElementById('overlay').style.display = 'block';
  }
}

function updateScore(newScore) {
  var oldScore = score;
  score = newScore;
  if (Math.floor(oldScore) != Math.floor(score)) {
    var scoreSpan = document.getElementById('score');
    scoreSpan.innerHTML = Math.floor(score);
  }
}
