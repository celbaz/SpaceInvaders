(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  // Game initialize
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

  Game.MAX_BULLETS = 20;
  Game.SHIP_BULLETS = 0;
  Game.FPS = 32;
  Game.NUM_INVADERS = 55;
  Game.COUNTER = 0;
  Game.DIRECTION = 3;
  Game.LEVEL = 1;

  // adds class instances
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
      this.add(new SpaceInvaders.Invader({
        game: this,
        direction: Game.DIRECTION,
        pos: this.invaderPosition()
      }));
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

  Game.prototype.addBullets = function () {
    var ship = this.ship[0];
    this.add( new SpaceInvaders.Bullet({
      pos: ship.pos,
      game: this,
      vel: [0,-5]
    }));

    return this.bullets;
  };

  // agregates all objects
  Game.prototype.allObjects = function () {
    return []
    .concat(this.ships)
    .concat(this.invaders)
    .concat(this.bullets);
  };

  // Preforms all canvas
  Game.prototype.drawAll = function(ctx) {
    this.allObjects().forEach(function (obj) {
      obj.draw(ctx);
    })
  }



  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0,Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0,0,Game.DIM_X, Game.DIM_Y);

    ctx.font = "24px Anonymous Pro";
    ctx.fillStyle = "#f00";
    ctx.fillText("Lives: " + this.ships[0].lives, 10, 30);
    ctx.fillText("Level: " + Game.LEVEL, 680, 30);
    this.drawAll(ctx);
  };

  // respective moving functions for each seperate array
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
    this.bullets.forEach( function (obj){
      obj.move();
    });
  };

  Game.prototype.invaderPosition = function () {
    if (this.invaders.length === 0) {
      return [Game.BOUNDS.boundX * 1.45, Game.BOUNDS.boundY];
    } else {
      var lastInvader = this.invaders[this.invaders.length-1];
      var lastInvaderX = lastInvader.pos[0];
      var lastInvaderY = lastInvader.pos[1];
      if (this.isWithinBounds(lastInvaderX, 0.45)) {
        return [( 30 + lastInvaderX), (lastInvaderY)];
      } else {
        return [Game.BOUNDS.boundX * 1.45, lastInvaderY + 30];
      }
    }
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

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0)
    || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
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
    } else if (object instanceof SpaceInvaders.Invader) {
      this.invaders.splice(this.invaders.indexOf(object), 1);
    } else if (object instanceof SpaceInvaders.Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    Game.COUNTER += 1;
    this.removeBullets();
    this.moveInvaders();
    this.moveShip();
    this.moveBullets();
    this.checkCollisions();
    this.nextLevel();
    if( Game.COUNTER % 100 === 0) {
      this.invaderFire();
    }
  };

  Game.prototype.lose = function () {
    var game = this;
    var bool = false;
    if(this.ships.length === 0){
      bool = true;
    } else {
      this.invaders.forEach( function (obj){

        if(obj.pos[1] >= Game.DIM_Y - 2*(SpaceInvaders.Ship.RADIUS)){
          bool = true;
        }
      });

    }
    return bool;
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

  Game.prototype.nextLevel = function () {
    if (this.invaders.length === 0) {
      Game.LEVEL += 1;
      Game.DIRECTION += 2;
      // if (Game.LEVEL % 2 === 0) { this.ships[0].lives +=1;}
      // this.bullets = [];
      this.addSpaceInvaders();
    }
  }

  Game.prototype.invaderCanFire = function () {
    var game = this;
    var invaderShooters = [];
    // console.log(this.invaders);
    game.invaders.forEach(function (obj1) {
      var bool = true;
      game.invaders.forEach(function (obj2) {
        if (obj1 === obj2) {

        } else if ((obj2.pos[0] === obj1.pos[0]) && (obj2.pos[1] === obj1.pos[1] + 30)) {
          bool = false;
        }
      });

      if (bool) {
        invaderShooters.push(obj1);
      }
    });
    return invaderShooters;
  };

  Game.prototype.invaderFire = function () {
    var shooters = this.invaderCanFire();
    var rand_shooters = Math.floor((Math.random() * shooters.length) + 1);
    var shooterIdxArr = [];

    for (var i = 0; i < rand_shooters; i++) {
      var shooter = Math.floor(Math.random() * shooters.length);
      if (shooterIdxArr.indexOf(shooter) === -1) {
        shooterIdxArr.push(shooter);
        shooters[shooter].fireBullet();
      }
    }
  };

  Game.prototype.removeBullets = function () {
    this.bullets.forEach(function (bullet) {
      if ((bullet.pos[1] >= Game.DIM_Y) || (bullet.pos[1] <= 0)) {
        if (bullet.bulletType === "ship") {
          Game.SHIP_BULLETS -= 1;
        }
        bullet.remove();
      }
    })
  };
})();
