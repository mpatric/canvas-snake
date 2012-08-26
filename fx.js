function StarBurst(location) {
  this.location = location;
  this.spread = 0;
  this.delta = 1;
}

StarBurst.prototype.update = function() {
  this.spread += this.delta;
  this.delta *= 1.5;
}

StarBurst.prototype.draw = function() {
  var colour = randomColour();
  var d = (Math.sqrt((this.spread * this.spread) / 2));
  retroCanvas.drawPixel(this.location.x + this.spread, this.location.y, 1, colour);
  retroCanvas.drawPixel(this.location.x + d, this.location.y + d, 1, colour);
  retroCanvas.drawPixel(this.location.x, this.location.y + this.spread, 1, colour);
  retroCanvas.drawPixel(this.location.x - d, this.location.y + d, 1, colour);
  retroCanvas.drawPixel(this.location.x - this.spread, this.location.y, 1, colour);
  retroCanvas.drawPixel(this.location.x - d, this.location.y - d, 1, colour);
  retroCanvas.drawPixel(this.location.x, this.location.y - this.spread, 1, colour);
  retroCanvas.drawPixel(this.location.x + d, this.location.y - d, 1, colour);
}

StarBurst.prototype.done = function() {
  return (this.location.x - this.spread < 0 && this.location.x + this.spread >= playField.width && this.location.y - this.spread < 0 && this.location.y + this.spread >= playField.height);
}