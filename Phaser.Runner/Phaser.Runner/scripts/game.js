﻿window.onload = function () {
    var game = new Runner.PhaserRunner();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Runner;
(function (Runner) {
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin(game, x, y, key, frame) {
            _super.call(this, game, x, y, "coins", frame);

            //Setup the coins
            this.scale.setTo(0.5);
            this.anchor.setTo(0.5);

            this.animations.add('spin');

            this.game.physics.arcade.enableBody(this);
            this.body.allowGravity = false;

            //Check if the coin is out of the screen
            this.checkWorldBounds = true;

            //If coins is out of the screen then kill the coin
            this.outOfBoundsKill = true;

            //Register events
            this.events.onKilled.add(this.onKilled, this);
            this.events.onRevived.add(this.onRevived, this);
        }
        //When the coin is revived starts at begining position and play the animation
        Coin.prototype.onRevived = function () {
            this.body.velocity.x = -400;
            this.animations.play('spin', 10, true);
        };

        //When coin is killed starts to the first frame animation
        Coin.prototype.onKilled = function () {
            this.animations.frame = 0;
        };
        return Coin;
    })(Phaser.Sprite);
    Runner.Coin = Coin;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y, key, frame) {
            _super.call(this, game, x, y, "missile", frame);

            //Setup the coins
            this.scale.setTo(0.1);
            this.anchor.setTo(0.5);

            //If we dont specify the array assumes all the frames
            this.animations.add('fly');

            this.game.physics.arcade.enableBody(this);
            this.body.allowGravity = false;

            //Check if the coin is out of the screen
            this.checkWorldBounds = true;

            //If coins is out of the screen then kill the coin
            this.outOfBoundsKill = true;

            //Register events
            this.events.onRevived.add(this.onRevived, this);
        }
        //When the coin is revived starts at begining position and play the animation
        Enemy.prototype.onRevived = function () {
            this.game.add.tween(this).to({ y: this.y - 16 }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);
            this.body.velocity.x = -400;
            this.animations.play('fly', 10, true);
        };
        return Enemy;
    })(Phaser.Sprite);
    Runner.Enemy = Enemy;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var Scoreboard = (function (_super) {
        __extends(Scoreboard, _super);
        function Scoreboard(game) {
            _super.call(this, game);
        }
        //Show the Scoreboard
        Scoreboard.prototype.show = function (score) {
            var bmd;
            var background;
            var gameoverText;
            var scoreText;
            var highScoreText;
            var newHighScoreText;
            var startText;

            //Create a new area to draw (BitMapData)
            bmd = this.game.add.bitmapData(this.game.width, this.game.height);
            bmd.ctx.fillStyle = '#000';
            bmd.ctx.fillRect(0, 0, this.game.width, this.game.height);

            //Create a new sprite with the new area to draw
            background = this.game.add.sprite(0, 0, bmd);
            background.alpha = 0.5;

            this.add(background);

            //Check if a new high score and if Yes store in local storage
            var isNewHighScore = false;
            var highscore = localStorage.getItem('highscore');
            if (!highscore || highscore < score) {
                isNewHighScore = true;
                highscore = score;
                localStorage.setItem('highscore', highscore);
            }

            //Hide the score board (go to the bottom to show later)
            this.y = this.game.height;

            gameoverText = this.game.add.bitmapText(0, 100, 'minecraftia', 'You Died.', 36);
            gameoverText.x = this.game.width / 2 - (gameoverText.textWidth / 2);
            this.add(gameoverText);

            scoreText = this.game.add.bitmapText(0, 200, 'minecraftia', 'Your Score: ' + score, 24);
            scoreText.x = this.game.width / 2 - (scoreText.textWidth / 2);
            this.add(scoreText);

            highScoreText = this.game.add.bitmapText(0, 250, 'minecraftia', 'Your High Score: ' + highscore, 24);
            highScoreText.x = this.game.width / 2 - (highScoreText.textWidth / 2);
            this.add(highScoreText);

            startText = this.game.add.bitmapText(0, 300, 'minecraftia', 'Tap to play again!', 16);
            startText.x = this.game.width / 2 - (startText.textWidth / 2);
            this.add(startText);

            if (isNewHighScore) {
                newHighScoreText = this.game.add.bitmapText(0, 100, 'minecraftia', 'New High Score!', 12);
                newHighScoreText.tint = 0x4ebef7; // '#4ebef7'
                newHighScoreText.x = gameoverText.x + gameoverText.textWidth + 40;
                newHighScoreText.angle = 45;
                this.add(newHighScoreText);
            }

            //Add animation to scoreboard to enter in the screen
            this.game.add.tween(this).to({ y: 0 }, 1000, Phaser.Easing.Bounce.Out, true);

            //If some input is down then start a new game
            this.game.input.onDown.addOnce(this.restart, this);
        };

        //Restart the game
        Scoreboard.prototype.restart = function () {
            //Start the Game state
            this.game.state.start('Game', true, false);
        };
        return Scoreboard;
    })(Phaser.Group);
    Runner.Scoreboard = Scoreboard;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    //Game state it's to prepare the preload bar and configure the settings (game scale and inputs)
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.call(this);
        }
        //First method to run when the object is instanciated
        Boot.prototype.preload = function () {
            this.load.image("logo", "assets/images/logo.png");
            this.load.image("preloadbar", "assets/images/preloader-bar.png");
        };

        //Next run the create method
        Boot.prototype.create = function () {
            //Set white background
            this.game.stage.backgroundColor = "#FFF";

            //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
                //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 568;
                this.scale.minHeight = 600;
                this.scale.maxWidth = 2048;
                this.scale.maxHeight = 1536;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.setScreenSize(true);
            }

            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            this.game.state.start('Preload');
        };

        //Run in every tick (60fps +-)
        Boot.prototype.update = function () {
        };

        //
        Boot.prototype.shutdown = function () {
        };
        return Boot;
    })(Phaser.State);
    Runner.Boot = Boot;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            this.backgroundVelocity = -100;
            this.playerMinAngle = -15;
            this.playerMaxAngle = 15;
            this.coinRate = 1000; //1 second
            this.coinTimer = 0;

            this.enemyRate = 500; //500 miliseconds
            this.enemyTimer = 0;

            this.score = 0;
        }
        Game.prototype.create = function () {
            this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
            this.background.autoScroll(-100, 0);

            this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
            this.foreground.autoScroll(-100, 0);

            this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
            this.ground.autoScroll(-400, 0);

            this.player = this.add.sprite(200, this.game.height / 2, 'player');
            this.player.anchor.setTo(0.5);
            this.player.scale.setTo(0.3);

            this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
            this.player.animations.play('fly', 8, true);

            //Enable Physics.. Phaser have 3 physics engine... Arcade, ninja and other... Arcade is the simplest one
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            //Add gravity to the Y axis
            this.game.physics.arcade.gravity.y = 400;

            //Add Physics to ground to have the collide methods but the floor does not have gravity and its immovable
            this.game.physics.arcade.enableBody(this.ground);
            this.ground.body.allowGravity = false;
            this.ground.body.immovable = true;

            //Add physics to player and collideworldbounds (not exit from screen)
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;

            this.coins = this.game.add.group();
            this.enemies = this.game.add.group();

            this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: 0', 24);

            //Sounds
            this.jetSound = this.game.add.audio('rocket');
            this.coinSound = this.game.add.audio('coin');
            this.deathSound = this.game.add.audio('death');
            this.gameMusic = this.game.add.audio('gameMusic');
            this.gameMusic.play("", 0, 0.5, true);
        };

        Game.prototype.update = function () {
            //Id tap or mouse click then player up
            if (this.game.input.activePointer.isDown) {
                this.player.body.velocity.y -= 25;

                if (!this.jetSound.isPlaying)
                    this.jetSound.play('', 0, 0.5, true);
            } else {
                this.jetSound.stop();
            }

            //Change player angle
            if (this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
                if (this.player.angle > 0) {
                    this.player.angle = 0;
                }
                if (this.player.angle > this.playerMinAngle) {
                    this.player.angle -= 0.5;
                }
            } else if (this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {
                if (this.player.angle < this.playerMaxAngle) {
                    this.player.angle += 0.5;
                }
            }

            //Create a coin each second
            if (this.coinTimer < this.game.time.now) {
                this.createCoin();
                this.coinTimer = this.game.time.now + this.coinRate;
            }

            //Create a enemy each 500 miliseconds
            if (this.enemyTimer < this.game.time.now) {
                this.createEnemy();
                this.enemyTimer = this.game.time.now + this.enemyRate;
            }

            //Checking if the player collides with the ground
            this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);

            this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
        };

        //When player collides de floor move up 100px
        Game.prototype.groundHit = function (player, ground) {
            player.body.velocity.y = -100;
        };

        //When player overlap the coin
        Game.prototype.coinHit = function (player, coin) {
            this.score++;
            this.coinSound.play();
            coin.kill();
            this.scoreText.text = 'Score: ' + this.score;
        };

        //When player overlap with an enemy
        Game.prototype.enemyHit = function (player, enemy) {
            player.kill();
            enemy.kill();

            this.deathSound.play();
            this.gameMusic.stop();

            this.ground.stopScroll();
            this.background.stopScroll();
            this.foreground.stopScroll();

            this.enemies.setAll('body.velocity.x', 0);
            this.coins.setAll('body.velocity.x', 0);

            this.enemyTimer = Number.MAX_VALUE;
            this.coinTimer = Number.MAX_VALUE;

            var scoreboard = new Runner.Scoreboard(this.game);
            scoreboard.show(this.score);
        };

        Game.prototype.createCoin = function () {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

            //Get the first coin with property exists == parameter value in this case (false)
            var coin = this.coins.getFirstExists(false);

            //Get the first dead coin
            //var coin = this.coins.getFirstDead();
            //If not exists any enemy then create a new coin else reuse a dead coin
            if (!coin) {
                coin = new Runner.Coin(this.game, 0, 0);
                this.coins.add(coin);
            }

            coin.reset(x, y);
            coin.revive();
        };

        Game.prototype.createEnemy = function () {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

            //Get the first coin with property exists == parameter value in this case (false)
            var enemy = this.coins.getFirstExists(false);

            //Get the first dead coin
            //var enemy = this.enemies.getFirstDead();
            //If not exists any coin then create a new enemy else reuse a dead enemy
            if (!enemy) {
                enemy = new Runner.Enemy(this.game, 0, 0);
                this.enemies.add(enemy);
            }

            enemy.reset(x, y);
            enemy.revive();
        };

        //Close this state
        Game.prototype.shutdown = function () {
            //Clean and Dispose all resources
            this.coins.destroy();
            this.enemies.destroy();
            this.score = 0;
            this.coinTimer = 0;
            this.enemyTimer = 0;
        };
        return Game;
    })(Phaser.State);
    Runner.Game = Game;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.call(this);
            this.backgroundVelocity = -100;
            this.floorVelocity = -400;
        }
        MainMenu.prototype.create = function () {
            //Paralax effect - floor is faster than the back and foreground
            //TileSprite are Tiles (azuleijos) so then just reapeat...
            this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
            this.background.autoScroll(this.backgroundVelocity, 0);

            this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
            this.foreground.autoScroll(this.backgroundVelocity, 0);

            this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
            this.ground.autoScroll(this.floorVelocity, 0);

            this.player = this.add.sprite(200, this.game.height / 2, 'player');
            this.player.anchor.setTo(0.5);
            this.player.scale.setTo(0.3); //Scale the player sprite to 30%

            //Add animation to player by sprite frame order
            this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);

            //8 Frame rate and loop!
            this.player.animations.play('fly', 8, true);

            // Add Tween (Between) Bouncing animation player up and down (yo yo)
            this.game.add.tween(this.player).to({ y: this.player.y - 16 }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);

            this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.splash.anchor.setTo(0.5);

            //Creating text first and after position text in the middle of the screen (we dont know the text width and height in before it's created)
            this.startText = this.game.add.bitmapText(0, 0, 'minecraftia', 'tap to start', 32);
            this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
            this.startText.y = this.game.height / 2 + this.splash.height / 2;
        };

        MainMenu.prototype.update = function () {
            //If Pressed then start the game (Active pointer can be mouse ou tap)
            if (this.game.input.activePointer.justPressed()) {
                this.game.state.start('Game');
            }
        };
        return MainMenu;
    })(Phaser.State);
    Runner.MainMenu = MainMenu;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    //Preload bar and loading all assets
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.call(this);

            this.preloadBarTopPadding = 128;
            this.ready = false;
        }
        Preload.prototype.preload = function () {
            this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.splash.anchor.setTo(0.5); //Image origin point It's always (0,0) but with this is in the middle.

            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + this.preloadBarTopPadding, 'preloadbar');
            this.preloadBar.anchor.setTo(0.5);

            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('ground', 'assets/images/ground.png');
            this.load.image('background', 'assets/images/background.png');
            this.load.image('foreground', 'assets/images/foreground.png');

            //sprite animation (width, height, number of frames)
            this.load.spritesheet('coins', 'assets/images/coins-ps.png', 51, 51, 7);
            this.load.spritesheet('player', 'assets/images/jetpack-ps.png', 229, 296, 4);
            this.load.spritesheet('missile', 'assets/images/missiles-ps.png', 361, 218, 4);

            //Some browers dont play mp3 and play ogg so phaser will take care of browser support
            this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3', 'assets/audio/Pamgaea.ogg']);

            //All browsers support .wav (EI dont :()
            this.load.audio('rocket', 'assets/audio/rocket.wav');
            this.load.audio('bounce', 'assets/audio/bounce.wav');
            this.load.audio('coin', 'assets/audio/coin.wav');
            this.load.audio('death', 'assets/audio/death.wav');

            //Loading fonts
            this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

            //When loader object complete then run the onLoadComplete  function.
            this.load.onLoadComplete.add(this.onLoadComplete, this);
        };

        Preload.prototype.update = function () {
            //Check if all images are loaded and the sound are decoded
            if (this.cache.isSoundDecoded('gameMusic') && this.ready) {
                this.game.state.start('MainMenu');
            }
        };

        Preload.prototype.onLoadComplete = function () {
            this.ready = true;
        };
        return Preload;
    })(Phaser.State);
    Runner.Preload = Preload;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var PhaserRunner = (function (_super) {
        __extends(PhaserRunner, _super);
        function PhaserRunner() {
            _super.call(this, innerWidth, innerHeight, Phaser.AUTO, '');

            //Add Game States
            this.state.add("Boot", Runner.Boot);
            this.state.add("Preload", Runner.Preload);
            this.state.add("MainMenu", Runner.MainMenu);
            this.state.add("Game", Runner.Game);

            //Start the Boot State (It's always the first state)
            this.state.start("Boot");
        }
        return PhaserRunner;
    })(Phaser.Game);
    Runner.PhaserRunner = PhaserRunner;
})(Runner || (Runner = {}));
//# sourceMappingURL=game.js.map
