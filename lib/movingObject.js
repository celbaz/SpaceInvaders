(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var MovingObject = SpaceInvaders.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.direction = options.direction;
    this.image = new Image();
    this.image.src = "stylesheet/invader-sprite.png";
  };

  MovingObject.prototype.collideWith = function (otherObject) {
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.drawImage( this.image, 0 , 0 , 120, 120, this.pos[0], this.pos[1],
      20, 20);

  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var centerDist = SpaceInvaders.Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  };

  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.move = function () {
  };

  MovingObject.prototype.moveDown = function () {

  }

  MovingObject.prototype.remove = function () {
    this.game.remove(this);
  };
})();