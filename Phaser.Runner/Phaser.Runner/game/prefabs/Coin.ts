module Runner {

    export class Coin extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any) {
            super(game, x, y, "coins", frame);

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
        private onRevived() {
            this.body.velocity.x = -400;
            this.animations.play('spin', 10, true);
        }

        //When coin is killed starts to the first frame animation
        private onKilled() {
            this.animations.frame = 0;
        }
    }
} 