var Color = function(red, green, blue, alpha){
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.alpha = alpha;
};

Color.prototype.toString = function(){
  return 'rgba(' + Math.floor(this.red) + ',' + Math.floor(this.green) +
    ',' + Math.floor(this.blue) + ',' + Math.floor(this.alpha) + ')';
}