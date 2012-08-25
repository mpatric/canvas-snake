// ---------- Game settings ----------
board_dimension = 50
max_mushrooms = 3;
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
  registerEventHandler(startButton, 'click', function() { start(); });
}

function start() {
  document.getElementById('buttons').style.display = 'none';
  playField = new PlayField(board_dimension, board_dimension);
  snake = new Snake(initial_snake_length);
  keyboardController = new KeyboardController();
  retroCanvas = new RetroCanvas(document.getElementById('game'), playField.width, playField.height);
  ticks = 0;
  ticker = setInterval(function() {
    tick();
  }, 66);
}

function stop() {
  clearInterval(ticker);
}

function tick() {
  if (snake.alive) {
    ticks++;
    snake.move();
    playField.update();
    playField.draw();
    snake.draw();
  } else {
    stop();
    document.getElementById('startButton').innerHTML = 'Play Again';
    document.getElementById('buttons').style.display = 'block';
  }
}
