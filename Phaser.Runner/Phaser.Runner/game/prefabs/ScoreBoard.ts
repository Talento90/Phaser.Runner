module Runner {

    export class Scoreboard extends Phaser.Group {

        constructor(game: Phaser.Game) {
            super(game);
 
        }

        //Show the Scoreboard
        public show(score: number) {
            var bmd: Phaser.BitmapData;
            var background: Phaser.Sprite;
            var gameoverText: Phaser.BitmapText;
            var scoreText: Phaser.BitmapText;
            var highScoreText: Phaser.BitmapText;
            var newHighScoreText: Phaser.BitmapText;
            var startText: Phaser.BitmapText;
   
            //Create a new area to draw (BitMapData)
            bmd = this.game.add.bitmapData(this.game.width, this.game.height);
            bmd.ctx.fillStyle = '#000';
            bmd.ctx.fillRect(0, 0, this.game.width, this.game.height);

            //Create a new sprite with the new area to draw
            background = this.game.add.sprite(0, 0, bmd);
            background.alpha = 0.5;

            this.add(background);

            //Check if a new high score and if Yes store in local storage
            var isNewHighScore = false;
            var highscore = localStorage.getItem('highscore');
            if (!highscore || highscore < score) {
                isNewHighScore = true;
                highscore = score;
                localStorage.setItem('highscore', highscore);
            }

            //Hide the score board (go to the bottom to show later)
            this.y = this.game.height;

            gameoverText = this.game.add.bitmapText(0, 100, 'minecraftia', 'You Died.', 36);
            gameoverText.x = this.game.width / 2 - (gameoverText.textWidth / 2);
            this.add(gameoverText);

            scoreText = this.game.add.bitmapText(0, 200, 'minecraftia', 'Your Score: ' + score, 24);
            scoreText.x = this.game.width / 2 - (scoreText.textWidth / 2);
            this.add(scoreText);

            highScoreText = this.game.add.bitmapText(0, 250, 'minecraftia', 'Your High Score: ' + highscore, 24);
            highScoreText.x = this.game.width / 2 - (highScoreText.textWidth / 2);
            this.add(highScoreText);

            startText = this.game.add.bitmapText(0, 300, 'minecraftia', 'Tap to play again!', 16);
            startText.x = this.game.width / 2 - (startText.textWidth / 2);
            this.add(startText);

            if (isNewHighScore) {
                newHighScoreText = this.game.add.bitmapText(0, 100, 'minecraftia', 'New High Score!', 12);
                newHighScoreText.tint = 0x4ebef7; // '#4ebef7'
                newHighScoreText.x = gameoverText.x + gameoverText.textWidth + 40;
                newHighScoreText.angle = 45;
                this.add(newHighScoreText);
            }

            //Add animation to scoreboard to enter in the screen
            this.game.add.tween(this).to({ y: 0 }, 1000, Phaser.Easing.Bounce.Out, true);

            //If some input is down then start a new game
            this.game.input.onDown.addOnce(this.restart, this);
        }

        //Restart the game 
        private restart() {
            //Start the Game state
            this.game.state.start('Game', true, false);
        }
    }
} 