var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 10);

function init() {
  playField = new PlayField(50, 50);
  snake = new Snake(playField, 5);
  keyboardController = new KeyboardController(snake);
  canvas = document.getElementById('game');
  ticker = setInterval(function() {
    tick();
  }, 66);
}

function stop() {
  clearInterval(ticker);
}

function tick() {
  if (snake.alive) {
    snake.move();
    playField.update();
    snake.draw(canvas);
  }
}

function each(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}

function map(array, action) {
  var result = []
  each(array, function(n) {
    result.push(action(n));
  });
  return result
}

function arrayHas(array, start, end, test) {
  for (var i = start; i < Math.min(array.length, end + 1); i++) {
    var t = test(array[i]);
    if (t) {
      return true;
    }
  }
  return false;
}
