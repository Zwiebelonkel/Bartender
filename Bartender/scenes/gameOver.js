
class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
    }

    create() {
        this.add.image(500, 375, 'bg');
        this.add.text(400, 300, 'Game Over', { fontSize: '48px Arial', fill: '#ffffff' });

        this.input.once('pointerdown', () => {
            this.scene.start('StartMenu');
        });
    }
}

export default GameOver;
