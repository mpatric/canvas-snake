function PlayField(width, height) {
  this.width = width;
  this.height = height;
}

PlayField.prototype.lethalSquare = function() {
  
}

PlayField.prototype.spawnMushroom = function() {
  // TODO
}

PlayField.prototype.eatMushroom = function() {
  // TODO
}

PlayField.prototype.killMushroom = function() {
  // TODO
}

function Snake(playField, length) {
  this.playField = playField;
  this.segments = [];
  this.alive = true;
  this.dx = 1;
  this.dy = 0;
  var x = Math.round(playField.width / 2);
  var y = Math.round(playField.height / 2);
  for (var i = 0; i < length; i++) {
    this.segments.push(new Object({x: x, y: y}))
  }
}

Snake.prototype.head = function() {
  return this.segments[0];
}

Snake.prototype.draw = function(canvas) {
  var context = canvas.getContext('2d');
  var xScale = canvas.width / this.playField.width;
  var yScale = canvas.height / this.playField.height;
  context.fillStyle = 'red';
  each(this.segments, function(segment) {
    context.fillRect(segment.x * xScale, segment.y * yScale, xScale, yScale);
  });
}

Snake.prototype.move = function() {
  snake = this;
  for (var i = snake.segments.length - 1; i > 0; i--) {
    snake.segments[i].x = snake.segments[i - 1].x;
    snake.segments[i].y = snake.segments[i - 1].y;
  }
  snake.head.x += snake.dx;
  snake.head.y += snake.dy;
  if (snake.hasMetItsDoom()) {
    snake.alive = false;
  }
}

Snake.prototype.hasMetItsDoom = function() {
  snake = this;
  if (snake.head.x < 0 || snake.head.x >= snake.playField.width || snake.head.y < 0 || snake.head.y >= snake.playField.height) {
    console.log('snake hit the edge of the play field');
    return true;
  }
  if (arrayHas(snake.segments, 1, function(segment) { return(snake.head.x == segment.x && snake.head.y == segment.y); })) {
    console.log('snake hit itself');
    return true;
  }
  return false;
}

/*

snake.move
snake.hasCrashed
snake.grow
snake.changeDirection(direction)

playField.blockContents (empty, mushroom, wall, snake segment?)
playField.spawnMushroom
playField.eatMushroom
playField.killMushroom

*/
