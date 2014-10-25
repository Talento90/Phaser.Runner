window.onload = function () {
    var game = new Runner.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Runner;
(function (Runner) {
    //Game state it's to prepare the preload bar and configure the settings (game scale and inputs)
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.call(this);
        }
        //First method to run when the object is instanciated
        Boot.prototype.preload = function () {
            this.load.image("logo", "assets/images/logo.png");
            this.load.image("preloadbar", "assets/images/preloader-bar.png");
        };

        //Next run the create method
        Boot.prototype.create = function () {
            //Set white background
            this.game.stage.backgroundColor = "#FFF";

            //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
                //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 568;
                this.scale.minHeight = 600;
                this.scale.maxWidth = 2048;
                this.scale.maxHeight = 1536;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.setScreenSize(true);
            }

            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            this.game.state.start('Preload');
        };

        //Run in every tick (60fps +-)
        Boot.prototype.update = function () {
        };

        //
        Boot.prototype.shutdown = function () {
        };
        return Boot;
    })(Phaser.State);
    Runner.Boot = Boot;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    //Game state it's to prepare the preload bar and configure the settings (game scale and inputs)
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.call(this);

            this.preloadBarTopPadding = 128;
            this.ready = false;
        }
        //First method to run when the object is instanciated
        Preload.prototype.preload = function () {
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
            this.load.audio('rocket', 'assets/audio/rocket.wav');
            this.load.audio('bounce', 'assets/audio/bounce.wav');
            this.load.audio('coin', 'assets/audio/coin.wav');
            this.load.audio('death', 'assets/audio/death.wav');

            //When loader object complete then run the onLoadComplete  function.
            this.load.onLoadComplete.add(this.onLoadComplete, this);
        };

        Preload.prototype.update = function () {
            //Check if all images are loaded and the sound are decoded
            if (this.cache.isSoundDecoded('gameMusic') && this.ready) {
                this.game.state.start('MainMenu');
            }
        };

        Preload.prototype.onLoadComplete = function () {
            this.ready = true;
        };
        return Preload;
    })(Phaser.State);
    Runner.Preload = Preload;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, innerWidth, innerHeight, Phaser.AUTO, '');

            //Add Game States
            this.state.add("Boot", Runner.Boot);
            this.state.add("Preload", Runner.Preload);

            //Start the Boot State (It's always the first state)
            this.state.start("Boot");
        }
        return Game;
    })(Phaser.Game);
    Runner.Game = Game;
})(Runner || (Runner = {}));
//# sourceMappingURL=game.js.map
