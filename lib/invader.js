(function () {
  if( typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var Invader = SpaceInvaders.Invader = function (options) {
    options.color = Invader.COLOR;
    options.pos = options.pos;
    options.radius = Invader.RADIUS;
    options.vel = options.vel;
    this.lives = options.lives;
    this.direction = options.direction;
    SpaceInvaders.MovingObject.call(this, options);
  };

  Invader.COLOR = "#505050";
  Invader.RADIUS = 10;

  SpaceInvaders.Util.inherits(Invader, SpaceInvaders.MovingObject);


  Invader.prototype.move = function () {
    this.pos = [this.pos[0] + this.direction, this.pos[1] ];
  };

  Invader.prototype.moveDown = function () {
    this.direction *= -1;
    this.pos = [this.pos[0] + this.direction, this.pos[1] + 30];
  }


})();
