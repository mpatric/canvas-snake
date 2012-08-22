// Point

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function(otherPoint) {
  return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
}

Point.prototype.isEqualTo = function(otherPoint) {
  return (this.x == otherPoint.x && this.y == otherPoint.y);
}

Point.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return "(" + this.x + "," + this.y + ")";
}


// PlayField

function PlayField(width, height) {
  this.width = width;
  this.height = height;
}

PlayField.prototype.update = function() {
  // TODO
}

PlayField.prototype.munchMushroom = function(x, y) {
  // TODO
  return false;
}


// Snake

function Snake(playField, length) {
  snake = this;
  snake.playField = playField;
  snake.segments = [];
  snake.alive = true;
  snake.dx = 1;
  snake.dy = 0;
  var x = Math.round(playField.width / 2);
  var y = Math.round(playField.height / 2);
  for (var i = 0; i < length; i++) {
    snake.segments.push(new Point(x, y));
  }
}

Snake.prototype.toString = function() {
  return map(this.segments, function(segment){
    return segment.toString();
  }).join(' ');
}

Snake.prototype.head = function() {
  return this.segments[0];
}

Snake.prototype.draw = function(canvas) {
  var context = canvas.getContext('2d');
  var xScale = canvas.width / this.playField.width;
  var yScale = canvas.height / this.playField.height;
  context.fillStyle = 'red';
  context.clearRect(0, 0, canvas.width, canvas.height);
  each(this.segments, function(segment) {
    context.fillRect(segment.x * xScale, segment.y * yScale, xScale, yScale);
  });
}

Snake.prototype.move = function() {
  snake = this;
  if (snake.willMeetItsDoom()) {
    snake.alive = false;
  } else {
    if (snake.willMunchAMushroom()) {
      snake.grow();
    }
    for (var i = snake.segments.length - 1; i > 0; i--) {
      snake.segments[i].set(snake.segments[i - 1].x, snake.segments[i - 1].y);
    }
    snake.head().set(snake.head().x + snake.dx, snake.head().y + snake.dy);
  }
}

Snake.prototype.willMeetItsDoom = function() {
  snake = this;
  var newX = snake.head().x + snake.dx;
  var newY = snake.head().y + snake.dy;
  if (newX < 0 || newX >= snake.playField.width || newY < 0 || newY >= snake.playField.height) {
    console.log('snake hit the edge of the play field');
    return true;
  }
  if (arrayHas(snake.segments, 0, snake.segments.length - 1, function(segment) { return(newX == segment.x && newY == segment.y); })) {
    console.log('snake hit itself');
    return true;
  }
  return false;
}

Snake.prototype.willMunchAMushroom = function() {
  return playField.munchMushroom(snake.head().x + snake.dx, snake.head().y + snake.dy);
}

Snake.prototype.grow = function() {
  // TODO
}

/*
snake.grow
snake.changeDirection(direction)
*/

// Keyboard controller

// left: 37
// right: 39
// up: 38
// down: 40

function KeyboardController(snake) {
  keyboardController = this;
  keyboardController.snake = snake;
  keyboardController.keysDown = [];
  document.onkeydown= function(event) { keyboardController.keyDown(event); }
  document.onkeyup= function(event) { keyboardController.keyUp(event); }
}

KeyboardController.prototype.keyDown = function(event) {
  var key= (event || window.event).keyCode;
}

KeyboardController.prototype.keyUp = function(event) {
  var key= (event || window.event).keyCode;
}
