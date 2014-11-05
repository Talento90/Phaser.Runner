module Runner {

    //Game state it's to prepare the preload bar and configure the settings (game scale and inputs)
    export class Boot extends Phaser.State {

        constructor() {
            super();
        }

        //First method to run when the object is instanciated
        public preload () {
            this.load.image("logo", "assets/images/logo.png");
            this.load.image("preloadbar", "assets/images/preloader-bar.png");
        }

        //Next run the create method
        public create() {
            //Set white background
            this.game.stage.backgroundColor = "#FFF";

            //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.setScreenSize(true);
            }

            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            this.game.state.start('Preload');
        }
    }
}

