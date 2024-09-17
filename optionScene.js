class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        this.add.text(100, 50, 'Options', { font: '48px Arial', fill: '#ffffff' });

        const music = this.sound.sounds.find(sound => sound.key === 'backgroundMusic');
        let musicToggle = this.add.text(100, 150, 'Music: ' + (music && music.isPlaying ? 'On' : 'Off'), { font: '36px Arial', fill: '#ffffff' });

        musicToggle.setInteractive();
        musicToggle.on('pointerdown', () => {
            if (music) {
                if (music.isPlaying) {
                    music.pause();
                    musicToggle.setText('Music: Off');
                } else {
                    music.resume();
                    musicToggle.setText('Music: On');
                }
            }
        });

        let backButton = this.add.text(100, 250, 'Back', { font: '36px Arial', fill: '#ffffff' });

        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Buttons hervorheben bei Hover
        [musicToggle, backButton].forEach(button => {
            button.on('pointerover', () => {
                button.setStyle({ fill: '#ff0' });
            });
            button.on('pointerout', () => {
                button.setStyle({ fill: '#ffffff' });
            });
        });
    }
}

export default OptionsScene;
