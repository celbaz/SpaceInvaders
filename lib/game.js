(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var Game = SpaceInvaders.Game = function () {
    this.invaders = [];
    this.bullets = [];
    this.ships = [];

    this.addSpaceInvaders();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 800;
  Game.DIM_Y = 500;
  Game.BOUNDS = {
    boundX: Game.DIM_X/10,
    boundXMax: 9*(Game.DIM_X/10),
    boundY: Game.DIM_Y/10,
    gameOver:   Game.DIM_Y - 2*(SpaceInvaders.Ship.RADIUS)
  };
  Game.FPS = 32;
  Game.NUM_INVADERS = 50;

  Game.prototype.add = function (object) {
    if (object instanceof SpaceInvaders.Invader) {
      this.invaders.push(object);
    } else if (object instanceof SpaceInvaders.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof SpaceInvaders.Ship) {
      this.ships.push(object);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addSpaceInvaders = function (numSpaceInvaders) {
    for (var i = 0; i < Game.NUM_INVADERS; i++) {
      this.add(new SpaceInvaders.Invader({ game: this, pos: this.invaderPosition() }));
    }
  };

  Game.prototype.addShip = function () {
    var ship = new SpaceInvaders.Ship({
      pos: this.shipPosition(),
      game: this
    });

    this.add(ship);

    return ship;
  };

  Game.prototype.allObjects = function () {
    return []
    .concat(this.ships)
    .concat(this.invaders)
    .concat(this.bullets);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 === obj2) {
          // don't allow self-collision
          return;
        }

        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };


  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0)
    || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveInvaders = function () {
    var bool = true;
    var game = this;
    this.invaders.forEach(function (obj) {
      if (!game.isWithinBounds(obj.pos[0], 0)) {
        bool = false;
      }
    })

    if (bool) {
      this.invaders.forEach(function (obj) {
        obj.move();
      });
    } else {
      this.invaders.forEach(function (obj) {
        bool = true;
        obj.moveDown();
      });

    }

  };

  Game.prototype.moveShip = function () {
      this.ships[0].move();
  };

  Game.prototype.moveBullets = function () {

  };

  Game.prototype.invaderPosition = function () {
    if (this.invaders.length === 0) {
      return [Game.BOUNDS.boundX * 1.25, Game.BOUNDS.boundY];
    } else {
      var lastInvader = this.invaders[this.invaders.length-1];
      var lastInvaderX = lastInvader.pos[0];
      var lastInvaderY = lastInvader.pos[1];
      if (this.isWithinBounds(lastInvaderX, 0.25)) {
        return [( 30 + lastInvaderX), (lastInvaderY)];
      } else {
        return [Game.BOUNDS.boundX * 1.25, lastInvaderY + 30];
      }
    }
  };

  Game.prototype.isWithinBounds = function (posX, percent) {
    return ((posX <= (Game.BOUNDS.boundXMax* (1 - percent)))
    && (posX >= Game.BOUNDS.boundX * (1 + percent)));
  };


  Game.prototype.randomPosition = function () {
    return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
    ];
  };

  Game.prototype.shipPosition = function () {
    return [
    Game.DIM_X * 0.5,
    Game.DIM_Y - 2*(SpaceInvaders.Ship.RADIUS)
    ];
  };

  Game.prototype.remove = function (object) {
    if (object instanceof SpaceInvaders.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof SpaceInvaders.Asteroid) {
      var idx = this.asteroids.indexOf(object);
      this.asteroids[idx] = new SpaceInvaders.Invader({ game: this });
    } else if (object instanceof SpaceInvaders.Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    this.moveInvaders();
    this.moveShip();
    this.moveBullets();
    this.checkCollisions();
  };


  Game.prototype.wrap = function (pos) {
    return [
    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap (coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };
})();
