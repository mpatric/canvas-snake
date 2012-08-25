// ---------- RetroCanvas ----------

function RetroCanvas(canvas, width, height) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.xScale = this.canvas.width / width;
  this.yScale = this.canvas.height / height;
}

RetroCanvas.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

RetroCanvas.prototype.drawPixel = function(x, y, scale, colour) {
  if (scale > 0) {
    this.context.fillStyle = colour;
    this.context.fillRect(((x + ((1 - scale) / 2)) * this.xScale) + 1, ((y + ((1 - scale) / 2)) * this.yScale) + 1, (scale * this.xScale) - 2, (scale * this.yScale) - 2);
  }
}

RetroCanvas.prototype.beginPath = function(x, y, colour) {
  this.context.fillStyle = 'none';
  this.context.strokeStyle = colour;
  this.context.lineWidth = ((this.xScale + this.yScale) / 2) - 2;
  this.context.beginPath((x + 0.5) * this.xScale, (y + 0.5) * this.yScale);
}

RetroCanvas.prototype.lineTo = function(x, y) {
  this.context.lineTo((x + 0.5) * this.xScale, (y + 0.5) * this.yScale);
}

RetroCanvas.prototype.endPath = function() {
  this.context.stroke();
}