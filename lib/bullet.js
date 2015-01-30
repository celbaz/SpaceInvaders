(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var Bullet = SpaceInvaders.Bullet = function (options) {
    options.radius = Bullet.RADIUS;
    options.color =  options.color || Bullet.COLOR;
    this.bulletType = options.bulletType;
    SpaceInvaders.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 4;
  Bullet.SPEED = 15;
  Bullet.COLOR = "#2ecc71";

  SpaceInvaders.Util.inherits(Bullet, SpaceInvaders.MovingObject);

  Bullet.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof SpaceInvaders.Invader) {
      if(this.bulletType === 'ship') {
        this.remove();
        otherObject.remove();
      }
    } else if (otherObject instanceof SpaceInvaders.Ship) {
      if (this.bulletType === 'invader') {
        this.remove();
        if( otherObject.lives === 0) {
          otherObject.remove();
        } else {
          console.log(otherObject.lives);
          otherObject.lives -= 1;
        }
      }
    }
  };

  Bullet.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );

    ctx.fill();
  };

  Bullet.prototype.move = function () {
    this.pos[1] += this.vel[1];
  };

  Bullet.prototype.isWrappable = false;
})();
