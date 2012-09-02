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
  this.life = min_mushroom_life + randomNumber(min_mushroom_life);
  this.scale = mushroom_growth_delta;
  this.scaling = mushroom_growth_delta;
}

Mushroom.prototype.update = function() {
  if (this.scaling != 0) {
    this.scale += this.scaling;
    if (this.scaling > 0 && this.scale >= 1) {
      this.scale = 1;
      this.scaling = 0;
    } else if (this.scaling < 0 && this.scale < (2 * mushroom_growth_delta)) {
      this.scale = 0;
      this.scaling = 0;
    }
  } else {
    this.life--;
    if (this.life == 1) {
      this.scaling = -mushroom_growth_delta;
    }
  }
}

Mushroom.prototype.alive = function() {
  return (this.life > 0);
}

Mushroom.prototype.draw = function() {
  retroCanvas.drawPixel(this.location.x, this.location.y, this.scale, 'green');
}

// ---------- Playfield ----------

function PlayField(width, height) {
  this.width = width;
  this.height = height;
  this.mushrooms = [];
  this.starBursts = [];
}

PlayField.prototype.update = function() {
  var i = 0;
  while (i < this.mushrooms.length) {
    this.mushrooms[i].update();
    if (!this.mushrooms[i].alive()) {
      this.removeMushroom(this.mushrooms[i]);
    } else {
      i++;
    }
  }
  if (this.mushrooms.length < max_mushrooms && randomNumber(mushroom_frequency) == 3) {
    this.spawnMushroom();
  }
  var i = 0;
  while (i < this.starBursts.length) {
    this.starBursts[i].update();
    if (this.starBursts[i].done()) {
      this.starBursts.splice(i, 1);
    } else {
      i++;
    }
  }
}

PlayField.prototype.spawnMushroom = function() {
  var location = new Point(0, 0);
  while (true) {
    location.set(randomNumber(playField.width), randomNumber(playField.height));
    if (this.mushroomAt(location) == undefined && !snake.hasSegmentAt(location)) {
      var mushroom = new Mushroom(location);
      this.mushrooms.push(mushroom);
      break;
    }
  }
}

PlayField.prototype.removeMushroom = function(mushroom) {
  var index = findIndex(this.mushrooms, function(mush) { return(mush == mushroom) });
  if (index >= 0) {
    this.mushrooms.splice(index, 1);
  }
}

PlayField.prototype.munchMushroom = function(point) {
  var mushroom = this.mushroomAt(point);
  if (mushroom != undefined) {
    this.starBursts.push(new StarBurst(mushroom.location));
    this.removeMushroom(mushroom);
    updateScore(score + mushroom_score);
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

PlayField.prototype.draw = function() {
  retroCanvas.clear();
  each(this.mushrooms, function(mushroom) {
    mushroom.draw();
  });
  each(this.starBursts, function(starBurst) {
    starBurst.draw();
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
  retroCanvas.beginPath(snake.head().x, snake.head().y, '#f00');
  each(this.segments, function(segment) {
    retroCanvas.lineTo(segment.x, segment.y);
  })
  retroCanvas.endPath();
  retroCanvas.drawPixel(snake.head().x, snake.head().y, 1, '#000');
  retroCanvas.drawPixel(snake.tail().x, snake.tail().y, 1, '#f00');
}

Snake.prototype.move = function() {
  var snake = this;
  if (snake.willMeetItsDoom()) {
    snake.alive = false;
  } else {
    if (ticks % snake_grows_after_ticks == 0) {
      snake.grow(1);
    }
    if (snake.willMunchAMushroom()) {
      snake.grow(segments_added_per_mushroom);
    }
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
    return true;
  }
  if (snake.hasSegmentAt(newHead)) {
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
  if (this.keysDown.findIndex(key) == -1) {
    this.keysDown.push(key);
    snake.changeDirection(keyMap[key]);
  }
}

KeyboardController.prototype.keyUp = function(event) {
  var key = (event || window.event).keyCode;
  var index = this.keysDown.findIndex(key);
  if (index >= 0) {
    this.keysDown.splice(index, 1);
  }
}

// ---------- Scoreboard ----------

function Scoreboard() {
  if (supports_local_storage()) {
    var data = localStorage.getItem("scoreboard") || "0,0,0,0,0,0,0,0,0,0";
    this.scores = data.split(',');
    for (var i = 0; i < this.scores.length; i++) { this.scores[i] = parseInt(this.scores[i]); }
  }
}

Scoreboard.prototype.addScore = function(playerScore) {
  if (this.scores) {
    var i = 0;
    while (i < this.scores.length) {
      if (playerScore >= this.scores[i]) {
        this.scores.splice(i, 0, playerScore);
        this.scores.splice(this.scores.length - 1, 1);
        this.playerScore = playerScore;
        localStorage.setItem("scoreboard", this.scores.toString());
        return;
      }
      i++;
    }
    this.playerScore = undefined;
  }
}

Scoreboard.prototype.render = function() {
  if (this.scores) {
    var scoreboard = this;
    var container = document.getElementById('highscores');
    var table = "<table><tr><th colspan='2'>Local High Scores</th></tr>";
    var i = 1;
    each(scoreboard.scores, function(score) {
      if (score == scoreboard.playerScore) {
        table += "<tr class='player'>";
        scoreboard.playerScore = undefined;
      } else {
        table += "<tr>";
      }
      table += "<td>" + i + "</td><td>" + scoreboard.scores[i - 1] + "</td>";
      i++;
    });
    table += "</table>";
    container.innerHTML = table;
  }
}
