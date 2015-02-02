(function () {
  if (typeof SpaceInvaders === "undefined") {
    window.SpaceInvaders = {};
  }

  var GameView = SpaceInvaders.GameView = function (ctx) {
    this.ctx = ctx;
    this.game = new SpaceInvaders.Game();
    this.ship = this.game.addShip();
    // console.log(this.ship);
    this.timerId = null;
  };

  GameView.MOVES = {
    "left": -10,
    "right": 10
  };

  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.ship;

    Object.keys(GameView.MOVES).forEach(function (k) {
      var move = GameView.MOVES[k];
      key(k, function () { ship.power(move) })
    })

    key("space", function () {ship.fireBullet()});
  };

  GameView.prototype.start = function () {
    var gameView = this;
    this.timerId = setInterval(
      function () {
        if ( gameView.game.lose() === true ) {
          gameView.stop();
          console.log("Stops Game");
          gameView.restart();

          console.log("Start Game");
        }

        gameView.game.step();
        gameView.game.draw(gameView.ctx);

      }, 1000 / SpaceInvaders.Game.FPS
    );

    this.bindKeyHandlers();
  };

GameView.prototype.restart = function () {
  this.game = new SpaceInvaders.Game();
  this.ship = this.game.addShip();
  this.start();
}

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };
})();
