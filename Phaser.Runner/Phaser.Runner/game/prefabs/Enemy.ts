module Runner {

    export class Enemy extends Phaser.Sprite {

        private static Velocity: number = -600;

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any) {
            super(game, x, y, "missile", frame);

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
        private onRevived() {
            this.game.add.tween(this).to({ y: this.y - 16 }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);
            this.body.velocity.x = Enemy.Velocity;
            this.animations.play('fly', 10, true);
        }
    }
} 