module Runner {

    export class PhaserRunner extends Phaser.Game {

        constructor() {

            //var width = window.innerWidth * window.devicePixelRatio;
            //var height = window.innerHeight * window.devicePixelRatio;

            var w = window.innerWidth * window.devicePixelRatio,
                h = window.innerHeight * window.devicePixelRatio,
                width = (h > w) ? h : w,
                height = (h > w) ? w : h;

            // Hack to avoid iPad Retina and large Android devices. Tell it to scale up.
            if (window.innerWidth >= 1024 && window.devicePixelRatio >= 2) {
                width = Math.round(width / 2);
                height = Math.round(height / 2);
            }
            // reduce screen size by one 3rd on devices like Nexus 5
            if (window.devicePixelRatio === 3) {
                width = Math.round(width / 3) * 2;
                height = Math.round(height / 3) * 2;
            }

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

