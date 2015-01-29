(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var Bullet = SpaceInvaders.Bullet = function (options) {
    options.radius = Bullet.RADIUS;
    options.color = options.color;

    SpaceInvaders.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 2;
  Bullet.SPEED = 15;

  SpaceInvaders.Util.inherits(Bullet, SpaceInvaders.MovingObject);

  Bullet.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof SpaceInvaders.Asteroid) {
      this.remove();
      otherObject.remove();
    }
  };

  Bullet.prototype.isWrappable = false;
})();
