(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  function randomColor () {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i ++) {
      color += hexDigits[Math.round((Math.random() * 16))];
    }

    return color;
  }

  var Ship = SpaceInvaders.Ship = function (options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();

    SpaceInvaders.MovingObject.call(this, options)
  };

  Ship.RADIUS = 15;

  SpaceInvaders.Util.inherits(Ship, SpaceInvaders.MovingObject);

  Ship.prototype.fireBullet = function () {
    var norm = SpaceInvaders.Util.norm(this.vel);

    if (norm == 0) {
      // Can't fire unless moving.
      return;
    }

    var relVel = SpaceInvaders.Util.scale(
      SpaceInvaders.Util.dir(this.vel),
      SpaceInvaders.Bullet.SPEED
    );

    var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
    ];

    var bullet = new SpaceInvaders.Bullet({
      pos: this.pos,
      vel: bulletVel,
      color: this.color,
      game: this.game
    });

    this.game.add(bullet);
  };

  Ship.prototype.move = function () {
      if(this.pos[0] <= SpaceInvaders.Game.BOUNDS.boundX){
        if (this.vel[0] > 0) {
          this.pos[0] += this.vel[0];
        } else {
          this.vel[0] = 0;
        }

      } else if (this.pos[0] >= SpaceInvaders.Game.BOUNDS.boundXMax){
        if (this.vel[0] < 0) {
          this.pos[0] += this.vel[0];
        } else {
          this.vel[0] = 0;
        }
      } else {
        this.pos[0] += this.vel[0];
      }
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse;
  };

  Ship.prototype.relocate = function () {
    this.pos = this.game.shipPosition();
    this.vel = [0, 0];
  };
})();
