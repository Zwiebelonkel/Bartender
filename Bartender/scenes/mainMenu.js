
class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    preload() {
        // Lade Assets hier
    }

    create() {
        // Erstelle deine Menüobjekte hier
        this.add.text(100, 100, 'Start Bartender', { font: '48px Arial', fill: '#ffffff' });

        // Start des Spiels bei Klick
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    update() {
        // Logik für Spielaktualisierung
    }
}

export default StartMenu;
