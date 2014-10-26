module Runner {

    export class MainMenu extends Phaser.State {

        private background: Phaser.TileSprite;
        private foreground: Phaser.TileSprite;
        private ground: Phaser.TileSprite;
        private player: Phaser.Sprite;
        private splash: Phaser.Sprite;
        private startText: Phaser.BitmapText;
        private backgroundVelocity: number;
        private floorVelocity: number;
       
        constructor() {
            super();
            this.backgroundVelocity = -100;
            this.floorVelocity = -400;
        }


        public create() {
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
        }


        public update() {
            //If Pressed then start the game (Active pointer can be mouse ou tap)
            if (this.game.input.activePointer.justPressed()) {
                this.game.state.start('Game');
            }
        }
    }
}

