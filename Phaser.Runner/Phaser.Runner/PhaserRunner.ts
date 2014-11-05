module Runner {

    export class PhaserRunner extends Phaser.Game {

        constructor() {

            var width = window.innerWidth * window.devicePixelRatio;
            var height = window.innerHeight * window.devicePixelRatio;

            super(width, height, Phaser.CANVAS, '');

            //Add Game States
            this.state.add("Boot", Runner.Boot);
            this.state.add("Preload", Runner.Preload);
            this.state.add("MainMenu", Runner.MainMenu);
            this.state.add("Game", Runner.Game);

            //Start the Boot State (It's always the first state)
            this.state.start("Boot");
        }
    
    }
}

