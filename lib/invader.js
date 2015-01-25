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
    SpaceInvaders.MovingObject.call(this, options);
  };

  Invader.COLOR = "#505050";
  Invader.RADIUS = 10;
  Invader.SPEED = 4;

  SpaceInvaders.Util.inherits(Invader, SpaceInvaders.MovingObject);

})();
