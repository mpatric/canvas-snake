var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 10);

function init() {
  playField = new PlayField(50, 50);
  snake = new Snake(playField, 5);
  canvas = document.getElementById('game');
  ticker = setInterval(function() {
    tick();
  }, 500);
}

function stop() {
  clearInterval(ticker);
}

function tick() {
  console.log('tick');
  if (snake.alive) {
    snake.move();
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

function arrayHas(array, start, test) {
  for (var i = start; i < array.length; i++) {
    var t = test(array[i]);
    if (t) {
      return true;
    }
  }
  return false;
}
