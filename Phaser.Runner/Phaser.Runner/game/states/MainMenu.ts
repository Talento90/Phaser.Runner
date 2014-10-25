module Runner {

    export class MainMenu extends Phaser.State {

        private background: Phaser.TileSprite;
        private foreground: Phaser.TileSprite;
        private ground: Phaser.TileSprite;
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
        }

    }
}

