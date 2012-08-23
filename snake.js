// Point

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function(otherPoint) {
  return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
}

Point.prototype.addTo = function(otherPoint) {
  this.set(this.x + otherPoint.x, this.y + otherPoint.y);
}

Point.prototype.isEqualTo = function(otherPoint) {
  return (this.x == otherPoint.x && this.y == otherPoint.y);
}

Point.prototype.toString = function() {
  return "(" + this.x + "," + this.y + ")";
}


// PlayField

function PlayField(width, height) {
  this.width = width;
  this.height = height;
  this.ticks = 0;
  this.score = 0;
}

PlayField.prototype.update = function() {
  this.ticks++;
  var oldScore = Math.floor(this.score);
  this.score += 0.1;
  if (oldScore != Math.floor(this.score)) {
    var scoreSpan = document.getElementById('score');
    scoreSpan.innerHTML = Math.floor(this.score);
  }
}

PlayField.prototype.munchMushroom = function(point) {
  // TODO
  return false;
}


// Snake

function Snake(playField, length) {
  var snake = this;
  snake.playField = playField;
  snake.segments = [];
  snake.alive = true;
  snake.direction = new Point(1, 0);
  snake.lastDirection = snake.direction;
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

Snake.prototype.tail = function() {
  return this.segments[this.segments.length - 1];
}

Snake.prototype.draw = function(canvas) {
  var context = canvas.getContext('2d');
  var xScale = canvas.width / this.playField.width;
  var yScale = canvas.height / this.playField.height;
  context.fillStyle = 'red';
  if (snake.previousTail != undefined && !snake.previousTail.isEqualTo(snake.head())) {
    context.clearRect(snake.previousTail.x * xScale, snake.previousTail.y * yScale, xScale, yScale);
  }
  context.fillRect(snake.head().x * xScale, snake.head().y * yScale, xScale, yScale);
}

Snake.prototype.move = function() {
  var snake = this;
  if (snake.willMeetItsDoom()) {
    snake.alive = false;
  } else {
    if (snake.playField.ticks % 10 == 0) {
      snake.grow();
    }
    if (snake.willMunchAMushroom()) {
      snake.grow();
    }
    snake.previousTail = new Point(snake.tail().x, snake.tail().y);
    for (var i = snake.segments.length - 1; i > 0; i--) {
      snake.segments[i].set(snake.segments[i - 1].x, snake.segments[i - 1].y);
    }
    snake.head().addTo(snake.direction);
    snake.lastDirection = snake.direction;
  }
}

Snake.prototype.willMeetItsDoom = function() {
  var snake = this;
  var newHead = snake.head().add(snake.direction);
  if (newHead.x < 0 || newHead.x >= snake.playField.width || newHead.y < 0 || newHead.y >= snake.playField.height) {
    console.log('snake hit the edge of the play field');
    return true;
  }
  if (arrayHas(snake.segments, 0, snake.segments.length - 1, function(segment) { return(newHead.x == segment.x && newHead.y == segment.y); })) {
    console.log('snake hit itself');
    return true;
  }
  return false;
}

Snake.prototype.willMunchAMushroom = function() {
  var newHead = snake.head().add(snake.direction);
  return playField.munchMushroom(newHead);
}

Snake.prototype.grow = function() {
  console.log('grow!');
  this.segments.push(new Point(snake.tail().x, snake.tail().y));
}

Snake.prototype.changeDirection = function(direction) {
  if (direction != undefined) {
    var d = this.lastDirection.add(direction);
    if (d.x != 0 || d.y != 0) { // don't allow player to move back in the direction they are going
      this.direction = direction;
    }
  }
}

/*
snake.grow
*/

// Keyboard controller

// left: 37
// right: 39
// up: 38
// down: 40

keyMap = new Object({37: new Point(-1, 0), 39: new Point(1, 0), 38: new Point(0, -1), 40: new Point(0, 1)});

function KeyboardController(snake) {
  var keyboardController = this;
  keyboardController.snake = snake;
  keyboardController.keysDown = [];
  document.onkeydown = function(event) { keyboardController.keyDown(event); }
  document.onkeyup = function(event) { keyboardController.keyUp(event); }
}

KeyboardController.prototype.keyDown = function(event) {
  var key = (event || window.event).keyCode;
  if (this.keysDown.indexOf(key) == -1) {
    this.keysDown.push(key);
    this.snake.changeDirection(keyMap[key]);
  }
}

KeyboardController.prototype.keyUp = function(event) {
  var key = (event || window.event).keyCode;
  var index = this.keysDown.indexOf(key);
  if (index >= 0) {
    this.keysDown.splice(index, 1);
  }
}
