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
        private coinRate: number;
        private coinTimer: number;

        private enemies: Phaser.Group;
        private enemyRate: number;
        private enemyTimer: number;

        private score: number;
        private scoreText: Phaser.BitmapText;

        constructor() {
            super();
            this.backgroundVelocity = -100;
            this.playerMinAngle = -15;
            this.playerMaxAngle = 15;
            this.coinRate = 1000; //1 second
            this.coinTimer = 0;

            this.enemyRate = 500; //500 miliseconds
            this.enemyTimer = 0;

            this.score = 0;
        }


        public create() {
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
        }


        public update() {
            //Id tap or mouse click then player up 
            if (this.game.input.activePointer.isDown) {
                this.player.body.velocity.y -= 25;
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
        }

        //When player collides de floor move up 100px
        private groundHit(player, ground) {
            player.body.velocity.y = -100;
        }

        //When player overlap the coin
        private coinHit(player: Phaser.Sprite, coin: Coin) {
            this.score++;
            coin.kill();
            this.scoreText.text = 'Score: ' + this.score;
        }

        //When player overlap with an enemy
        private enemyHit(player: Phaser.Sprite, enemy: Enemy) {
            player.kill();
            enemy.kill();

            this.ground.stopScroll();
            this.background.stopScroll();
            this.foreground.stopScroll();

            this.enemies.setAll('body.velocity.x', 0);
            this.coins.setAll('body.velocity.x', 0);

            this.enemyTimer = Number.MAX_VALUE;
            this.coinTimer = Number.MAX_VALUE;

            var scoreboard = new Scoreboard(this.game);
            scoreboard.show(this.score);
        }

        private createCoin() {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192); //Get a y coordinate between top and floor (-192)

            //Get the first coin with property exists == parameter value in this case (false)
            var coin = this.coins.getFirstExists(false);
            //Get the first dead coin 
            //var coin = this.coins.getFirstDead();

            //If not exists any enemy then create a new coin else reuse a dead coin
            if (!coin) {
                coin = new Coin(this.game, 0, 0);
                this.coins.add(coin);
            }
          
            coin.reset(x, y);
            coin.revive();
        }

        private createEnemy() {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192); //Get a y coordinate between top and floor (-192)

            //Get the first coin with property exists == parameter value in this case (false)
            var enemy = this.coins.getFirstExists(false);
            //Get the first dead coin 
            //var enemy = this.enemies.getFirstDead();

            //If not exists any coin then create a new enemy else reuse a dead enemy
            if (!enemy) {
                enemy = new Enemy(this.game, 0, 0);
                this.enemies.add(enemy);
            }
          
            enemy.reset(x, y);
            enemy.revive();
        }

        public shutdown() {
            //Clean and Dispose all resources
            this.coins.destroy();
            this.enemies.destroy();
            this.score = 0;
            this.coinTimer = 0;
            this.enemyTimer = 0;
        }

    }
}

