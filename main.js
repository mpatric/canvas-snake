var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 10);

function init() {
  var startButton = document.getElementById('startButton');
  registerEventHandler(startButton, 'click', function() { console.log('clicked'); start(); });
}

function start() {
  document.getElementById('buttons').style.display = 'none';
  playField = new PlayField(50, 50);
  snake = new Snake(5);  
  keyboardController = new KeyboardController();
  canvas = document.getElementById('game');
  context = canvas.getContext('2d');
  xScale = canvas.width / playField.width;
  yScale = canvas.height / playField.height;
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
    document.getElementById('buttons').style.display = 'block';
  }
}
