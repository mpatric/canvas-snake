function PlayField(width, height) {
  this.width = width;
  this.height = height;
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


function Snake(playField) {
  this.playField = playField;
  this.segments = [new Object({x: Math.round(playField.width / 2), y: Math.round(playField.height / 2)})];
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


/*

snake.move(direction)
snake.hasCrashed
snake.grow

playField.spawnMushroom
playField.eatMushroom
playField.killMushroom

*/