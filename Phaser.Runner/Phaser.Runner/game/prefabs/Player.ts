module Runner {

    export class Player extends Phaser.Sprite {

        private static JumpHeigth: number = 25;
        private static PlayerMinAngle: number = -15;
        private static PlayerMaxAngle: number = 15;

        private jetSound: Phaser.Sound;
        private shadow: Phaser.Sprite;

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any) {
            super(game, x, y, "player", frame);

            this.anchor.setTo(0.5);
            this.scale.setTo(0.25);
            this.animations.add('fly', [0, 1, 2, 3, 2, 1]);
            this.animations.play('fly', 8, true);

            //Add physics to player and collideworldbounds (not exit from screen)
            this.game.physics.arcade.enableBody(this);
            this.body.collideWorldBounds = true;

            // create shadow
            this.shadow = this.game.add.sprite(this.x, this.game.world.height - 73, 'shadow');
            this.shadow.anchor.setTo(0.5, 0.5);

            this.jetSound = this.game.add.audio('rocket');       
        }

        public fly(): void {
            this.body.velocity.y -= Player.JumpHeigth;

            if (!this.jetSound.isPlaying) {
                this.jetSound.play('', 0, 0.5, false, true);
            }

            this.animations.play('fly', 16);
        }

        public stopFly(): void {
            this.jetSound.stop();
        }

        public updateAngle(): void {

            //Change player angle
            if (this.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
                if (this.angle > 0) {
                    this.angle = 0;
                }
                if (this.angle > Player.PlayerMinAngle) {
                    this.angle -= 0.5;
                }
            }

            if (this.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {

                if (this.angle < Player.PlayerMaxAngle) {
                    this.angle += 0.5;
                }
            }      
        }

        public updateShadow(): void {
            //Scale de shadow by playr distance from the floor
            this.shadow.scale.setTo(this.y / this.game.height);
        }
    }
} 