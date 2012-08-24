// ---------- Point ----------

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

// ---------- Mushroom ----------

function Mushroom(point) {
  this.location = point;
  this.life = 40 + randomNumber(40);
}

Mushroom.prototype.update = function() {
  this.life--;
}

Mushroom.prototype.alive = function() {
  return (this.life > 0);
}

Mushroom.prototype.draw = function() {
  context.fillStyle = 'green';
  context.fillRect(this.location.x * xScale, this.location.y * yScale, xScale, yScale);
}

Mushroom.prototype.undraw = function() {
  context.clearRect(this.location.x * xScale, this.location.y * yScale, xScale, yScale);
}

// ---------- Playfield ----------

function PlayField(width, height) {
  this.width = width;
  this.height = height;
  this.score = 0;
  this.mushrooms = [];
}

PlayField.prototype.update = function() {
  var oldScore = Math.floor(this.score);
  this.score += 0.1;
  if (oldScore != Math.floor(this.score)) {
    var scoreSpan = document.getElementById('score');
    scoreSpan.innerHTML = Math.floor(this.score);
  }
  var i = 0;
  while (i < this.mushrooms.length) {
    this.mushrooms[i].update();
    if (!this.mushrooms[i].alive()) {
      this.removeMushroom(this.mushrooms[i]);
    } else {
      i++;
    }
  }
  if (this.mushrooms.length < 3 && randomNumber(20) == 3) {
    this.spawnMushroom();
  }
}

PlayField.prototype.spawnMushroom = function() {
  var location = new Point(0, 0);
  while (true) {
    location.set(randomNumber(playField.width), randomNumber(playField.height));
    if (this.mushroomAt(location) == undefined && !snake.hasSegmentAt(location)) {
      console.log("spawn mushroom at " + location.x + ", " + location.y);
      var mushroom = new Mushroom(location);
      this.mushrooms.push(mushroom);
      mushroom.draw();
      break;
    }
  }
}

PlayField.prototype.removeMushroom = function(mushroom) {
  mushroom.undraw();
  var index = indexOf(this.mushrooms, function(mush) { return(mush == mushroom) });
  if (index >= 0) {
    this.mushrooms.splice(index, 1);
  }
}

PlayField.prototype.munchMushroom = function(point) {
  var mushroom = this.mushroomAt(point);
  if (mushroom != undefined) {
    console.log("munch mushroom at " + point.x + ", " + point.y);
    this.removeMushroom(mushroom);
    this.score += 25;
    return true;
  } else {
    return false;
  }
}

PlayField.prototype.mushroomAt = function(point) {
  return find(this.mushrooms, function(mush) {
    return(mush.alive() && mush.location.isEqualTo(point));
  });
}

// ---------- Snake ----------

function Snake(length) {
  var snake = this;
  snake.segments = [];
  snake.alive = true;
  snake.direction = new Point(1, 0);
  snake.lastDirection = snake.direction;
  x = Math.round(playField.width / 2);
  y = Math.round(playField.height / 2);
  for (var i = 0; i < length; i++) {
    snake.segments.push(new Point(x, y));
  }
}

Snake.prototype.head = function() {
  return this.segments[0];
}

Snake.prototype.tail = function() {
  return this.segments[this.segments.length - 1];
}

Snake.prototype.hasSegmentAt = function(location) {
  return (arrayHas(this.segments, function(segment) {
    return(segment.isEqualTo(location));
  }));
}

Snake.prototype.draw = function() {
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
    if (ticks % 10 == 0) {
      snake.grow(1);
    }
    if (snake.willMunchAMushroom()) {
      snake.grow(10);
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
  if (newHead.x < 0 || newHead.x >= playField.width || newHead.y < 0 || newHead.y >= playField.height) {
    console.log('snake hit the edge of the play field');
    return true;
  }
  if (snake.hasSegmentAt(newHead)) {
    console.log('snake hit itself');
    return true;
  }
  return false;
}

Snake.prototype.willMunchAMushroom = function() {
  var newHead = snake.head().add(snake.direction);
  return playField.munchMushroom(newHead);
}

Snake.prototype.grow = function(length) {
  for (var i = 0; i < length; i++) {
    this.segments.push(new Point(snake.tail().x, snake.tail().y));
  }
}

Snake.prototype.changeDirection = function(direction) {
  if (direction != undefined) {
    var d = this.lastDirection.add(direction);
    if (d.x != 0 || d.y != 0) { // don't allow player to move back in the direction they are going
      this.direction = direction;
    }
  }
}


// ---------- Keyboard controller ----------

keyMap = new Object({37: new Point(-1, 0), 39: new Point(1, 0), 38: new Point(0, -1), 40: new Point(0, 1)});

function KeyboardController() {
  var keyboardController = this;
  keyboardController.keysDown = [];
  document.onkeydown = function(event) { keyboardController.keyDown(event); }
  document.onkeyup = function(event) { keyboardController.keyUp(event); }
}

KeyboardController.prototype.keyDown = function(event) {
  var key = (event || window.event).keyCode;
  if (this.keysDown.indexOf(key) == -1) {
    this.keysDown.push(key);
    snake.changeDirection(keyMap[key]);
  }
}

KeyboardController.prototype.keyUp = function(event) {
  var key = (event || window.event).keyCode;
  var index = this.keysDown.indexOf(key);
  if (index >= 0) {
    this.keysDown.splice(index, 1);
  }
}
