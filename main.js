var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    init();
    clearInterval(readyStateCheckInterval);
  }
}, 10);

function init() {
  var playField = new PlayField(50, 50);
  var snake = new Snake(playField);
  var canvas = document.getElementById('game');
  snake.draw(canvas);
}

function each(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}
