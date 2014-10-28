module Runner {

    export class Game extends Phaser.State {

        private background: Phaser.TileSprite;
        private foreground: Phaser.TileSprite;
        private ground: Phaser.TileSprite;
        private player: Phaser.Sprite;
        private backgroundVelocity: number;
        private playerMinAngle: number;
        private playerMaxAngle: number;

        constructor() {
            super();
            this.backgroundVelocity = -100;
            this.playerMinAngle = -15;
            this.playerMaxAngle = 15;
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

            //Checking if the player collides with the ground
            this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
        }

        private groundHit(player, ground) {
            player.body.velocity.y = -100;
        }
    }
}

