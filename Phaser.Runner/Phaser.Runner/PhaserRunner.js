var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var PhaserRunner = (function (_super) {
        __extends(PhaserRunner, _super);
        function PhaserRunner() {
            //var width = window.innerWidth * window.devicePixelRatio;
            //var height = window.innerHeight * window.devicePixelRatio;
            var w = window.innerWidth * window.devicePixelRatio, h = window.innerHeight * window.devicePixelRatio, width = (h > w) ? h : w, height = (h > w) ? w : h;
            if (window.innerWidth >= 1024 && window.devicePixelRatio >= 2) {
                width = Math.round(width / 2);
                height = Math.round(height / 2);
            }
            if (window.devicePixelRatio === 3) {
                width = Math.round(width / 3) * 2;
                height = Math.round(height / 3) * 2;
            }
            _super.call(this, width, height, Phaser.CANVAS, '');
            this.state.add("Boot", Runner.Boot);
            this.state.add("Preload", Runner.Preload);
            this.state.add("MainMenu", Runner.MainMenu);
            this.state.add("Game", Runner.Game);
            this.state.start("Boot");
        }
        return PhaserRunner;
    })(Phaser.Game);
    Runner.PhaserRunner = PhaserRunner;
})(Runner || (Runner = {}));
