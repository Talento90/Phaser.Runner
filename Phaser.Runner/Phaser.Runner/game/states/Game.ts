module Runner {

    export class Game extends Phaser.State {

        private background: Phaser.TileSprite;
        private foreground: Phaser.TileSprite;
        private ground: Phaser.TileSprite;
        private player: Phaser.Sprite;
        private backgroundVelocity: number;
        private playerMinAngle: number;
        private playerMaxAngle: number;

        private coins: Phaser.Group;
        private enemies: Phaser.Group;

        private score: number;
        private scoreText: Phaser.BitmapText;

        private jetSound: Phaser.Sound;
        private coinSound: Phaser.Sound;
        private deathSound: Phaser.Sound;
        private gameMusic: Phaser.Sound;
        private bounceSound: Phaser.Sound;
        
        private previousCoinType: number = null;
        private coinSpacingX: number = 10;
        private coinSpacingY: number = 10;

        private spawnX: number = null;

        private shadow: Phaser.Sprite;
        private scoreboard: Scoreboard;

        private enemyGenerator: Phaser.TimerEvent;
        private coinGenerator: Phaser.TimerEvent;

        constructor() {
            super();
            this.backgroundVelocity = -100;
            this.playerMinAngle = -15;
            this.playerMaxAngle = 15;
            this.score = 0;
        }


        public create() {

            //For FPS
            this.game.time.advancedTiming = true;

            // set up the game world bounds It's bigger width because we whant to generate coin groups
            this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width + 300, this.game.height);

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

            //Init Groups
            this.coins = this.game.add.group();
            this.enemies = this.game.add.group();


            this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: 0', 24);

            // create shadow
            this.shadow = this.game.add.sprite(this.player.x, this.game.world.height - 73, 'shadow');
            this.shadow.anchor.setTo(0.5, 0.5);

            this.scoreboard = new Scoreboard(this.game);

            //Sounds
            this.jetSound = this.game.add.audio('rocket');
            this.coinSound = this.game.add.audio('coin');
            this.deathSound = this.game.add.audio('death');
            this.bounceSound = this.game.add.audio('bounce');
            this.gameMusic = this.game.add.audio('gameMusic');
            this.gameMusic.play("", 0, 0.5, true);

            // create an enemy spawn loop
            this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.createEnemy, this);
            this.enemyGenerator.timer.start();

            // create a coin spawn loop
            this.coinGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateCoins, this);
            this.coinGenerator.timer.start();
            this.spawnX = this.game.width + 64;
        }

        public update() {

            if (this.player.alive) {
                if (this.game.input.activePointer.isDown) {
                    this.player.body.velocity.y -= 25;
                    if (!this.jetSound.isPlaying) {
                        this.jetSound.play('', 0, 0.5, false, true);
                    }
                    this.player.animations.play('fly', 16);
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
                }

                if (this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {

                    if (this.player.angle < this.playerMaxAngle) {
                        this.player.angle += 0.5;
                    }
                }
                //Scale de shadow by playr distance from the floor
                this.shadow.scale.setTo(this.player.y / this.game.height);

                //Checking if the player collides with the ground
                this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
                this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
                this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);

            } else {
                this.game.physics.arcade.collide(this.player, this.ground);
            }
        }

        //When player collides de floor move up 100px
        private groundHit(player, ground) {
            this.player.angle = 0;
            this.player.body.velocity.y = -100;
            this.bounceSound.play();
        }

        //When player overlap the coin
        private coinHit(player: Phaser.Sprite, coin: Coin) {
            this.score++;
            this.coinSound.play();
            coin.kill();

            var dummyCoin = new Coin(this.game, coin.x, coin.y);
            this.game.add.existing(dummyCoin);

            dummyCoin.animations.play('spin', 40, true);

            var scoreTween = this.game.add.tween(dummyCoin).to({ x: 50, y: 50 }, 300, Phaser.Easing.Linear.None, true);

            scoreTween.onComplete.add(function () {
                dummyCoin.destroy();
                this.scoreText.text = 'Score: ' + this.score;
            }, this);
        }


        private createCoin(x?: number, y?: number): Coin {
            x = x || this.spawnX;
            y = y || this.game.rnd.integerInRange(50, this.game.world.height - 192);
            
            // recycle our coins
            //Get the first dead coin 
            var coin = this.coins.getFirstDead();

            if (!coin) {
                coin = new Coin(this.game, 0, 0);
                this.coins.add(coin);
            }

            coin.reset(x, y);
            coin.revive();
            return coin;
        }

        private createCoinGroup(columns: number, rows: number) {
            //create 4 coins in a group
            var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
            var coinRowCounter = 0;
            var coinColumnCounter = 0;
            var coin;
            for (var i = 0; i < columns * rows; i++) {
                coin = this.createCoin(this.spawnX, coinSpawnY);
                coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
                coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
                coinColumnCounter++;
                if (i + 1 >= columns && (i + 1) % columns === 0) {
                    coinRowCounter++;
                    coinColumnCounter = 0;
                }
            }
        }

        private generateCoins() {
            if (!this.previousCoinType || this.previousCoinType < 3) {
                var coinType = this.game.rnd.integer() % 5;
                switch (coinType) {
                    case 0:
                        //do nothing. No coins generated
                        break;
                    case 1:
                    case 2:
                        // if the cointype is 1 or 2, create a single coin
                        this.createCoin();
                        break;
                    case 3:
                        // create a small group of coins
                        this.createCoinGroup(2, 2);
                        break;
                    case 4:
                        //create a large coin group
                        this.createCoinGroup(6, 2);
                        break;
                    default:
                        // if somehow we error on the cointype, set the previouscointype to zero and do nothing
                        this.previousCoinType = 0;
                        break;
                }

                this.previousCoinType = coinType;
            } else {
                if (this.previousCoinType === 4) {
                    // the previous coin generated was a large group, 
                    // skip the next generation as well
                    this.previousCoinType = 3;
                } else {
                    this.previousCoinType = 0;
                }

            }
        }

        private createEnemy() {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192); //Get a y coordinate between top and floor (-192)

            //Get the first dead coin 
            var enemy = this.enemies.getFirstDead();

            //If not exists any coin then create a new enemy else reuse a dead enemy
            if (!enemy) {
                console.log("create new enemy");
                enemy = new Enemy(this.game, 0, 0);
                this.enemies.add(enemy);
            }

            enemy.reset(x, y);
            enemy.revive();
        }

        //When player overlap with an enemy
        private enemyHit(player: Phaser.Sprite, enemy: Enemy) {
            this.player.alive = false;
            this.player.animations.stop();

            this.deathSound.play();
            this.gameMusic.stop();

            this.ground.stopScroll();
            this.background.stopScroll();
            this.foreground.stopScroll();

            this.enemies.setAll('body.velocity.x', 0);
            this.coins.setAll('body.velocity.x', 0);

            this.shadow.destroy();
            this.enemyGenerator.timer.stop();
            this.coinGenerator.timer.stop();

            var deathTween = this.game.add.tween(this.player).to({ angle: 180 }, 2000, Phaser.Easing.Bounce.Out, true);
            deathTween.onComplete.add(this.showScoreboard, this);
        }
        
        private showScoreboard() {
            this.scoreboard.show(this.score);
        }

        //Close this state
        public shutdown() {
            console.log('shutting down');
            //Clean and Dispose all resources
            this.coins.destroy();
            this.enemies.destroy();
            this.score = 0;
            this.scoreboard.destroy();
            this.coinGenerator.timer.destroy();
            this.enemyGenerator.timer.destroy();
        }


        public render() {
            this.game.debug.text(this.game.time.fps.toString() || '--', 2, 14, "#00ff00");
        }
    }
}

