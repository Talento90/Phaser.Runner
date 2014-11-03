module Runner {

    //Preload bar and loading all assets 
    export class Preload extends Phaser.State {

        private preloadBarTopPadding: number;
        private splash: Phaser.Sprite;
        private preloadBar: Phaser.Sprite;
        private ready: boolean;

        constructor() {
            super();

            this.preloadBarTopPadding = 128;
            this.ready = false;
        }

        public preload () {
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

            //All browsers support .wav
            this.load.audio('rocket', 'assets/audio/rocket.wav', true);
            this.load.audio('bounce', 'assets/audio/bounce.wav', true);
            this.load.audio('coin', 'assets/audio/coin.wav', true);
            this.load.audio('death', 'assets/audio/death.wav', true);

            //Loading fonts
            this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

            //When loader object complete then run the onLoadComplete  function.
            this.load.onLoadComplete.add(this.onLoadComplete, this);
        }

        public update() {

            //Check if all images are loaded and the sound are decoded
            if (this.cache.isSoundDecoded('gameMusic') && this.ready) {
                this.game.state.start('MainMenu');
            }
        }

        private onLoadComplete() {
            this.ready = true;
        }

    }
}

