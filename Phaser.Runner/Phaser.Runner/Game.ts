module Runner {

    export class Game extends Phaser.Game {

        constructor() {

            super(innerWidth, innerHeight, Phaser.AUTO, '');

            //Add Game States
            this.state.add("Boot", Runner.Boot);
            this.state.add("Preload", Runner.Preload);

            //Start the Boot State (It's always the first state)
            this.state.start("Boot");
        }
    
    }
}

