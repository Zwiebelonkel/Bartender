// Globales Objekt zum Speichern des Kaufstatus von Dekorationen
let purchasedDecorations = {
    sofa: false,
    painting: false,
    lamp: false
};

class DecorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecorScene' });
    }

    init(data) {
        this.score = data.score;
        this.playerLives = data.lives;
        this.playerJumpHeight = data.playerJumpHeight;
        this.playerSpeed = data.playerSpeed;
        this.playerAttackRange = data.playerAttackRange;

        // Laden des Kaufstatus von Dekorationen
        const savedData = window.localStorage.getItem('purchasedDecorations');
        if (savedData) {
            purchasedDecorations = JSON.parse(savedData);
        }
    }

    preload() {
        // Hier laden wir die notwendigen Assets für die Dekorationen und das Haus
        this.load.image('house_bg', 'assets/bg.png');
        this.load.image('sofa', 'assets/sofa.png');
        this.load.image('painting', 'assets/painting.png');
        this.load.image('lamp', 'assets/lamp.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('ground', 'assets/platform.png');
    }

    create() {
        // Hintergrundbild des Hauses setzen
        this.add.image(500, 375, 'house_bg');
        this.add.text(16, 16, 'Decorations Shop', { fontSize: '32px', fill: '#000' });
        this.moneyText = this.add.text(16, 48, `Money: ${this.score}`, { fontSize: '32px', fill: '#000' });

        // Bereits gekaufte Dekorationen anzeigen
        this.displayPurchasedDecorations();

        // Dekorationsbuttons erstellen
        this.createDecorButton('Sofa - $50', 100, 100, 'sofa', 50);
        this.createDecorButton('Painting - $30', 100, 150, 'painting', 30);
        this.createDecorButton('Lamp - $20', 100, 200, 'lamp', 20);

        // Button zur ShopScene für Upgrades
        this.createUpgradeButton('Go to Upgrades', 100, 300, () => this.goToShopScene());

        // Spieler-Charakter
        this.player = this.physics.add.sprite(300, 450, 'dude');
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(5);

        // Hitbox des Spielers anpassen (falls zu groß)
        this.player.setSize(32, 32).setOffset(0, 0);

        // Animationen für den Spieler-Charakter
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 13 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.player.anims.play('idle');

        // Steuerung
        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(1000, 825, 'ground').setScale(5).refreshBody();
        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Spieler-Steuerung
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.anims.play('left', true);
            this.direction = "left";
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.anims.play('right', true);
            this.direction = "right";
        
        } else {
            this.player.setVelocityX(0);
            if (!this.player.anims.currentAnim || this.player.anims.currentAnim.key !== 'idle') {
                this.player.anims.play('idle', true);
            }
            this.isWhooshPlaying = false; // Reset der whoosh-Sound-Variable
            this.isjumpPlaying = false; // Reset der whoosh-Sound-Variable
            this.isPunchPlaying = false; // Reset der whoosh-Sound-Variable
        }

        // Sprung
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(this.playerJumpHeight);
            if (!this.isjumpPlaying) {
                var jump = this.sound.add('jump');
                jump.play();
                this.isjumpPlaying = true;
            }
        }
    }

    createDecorButton(text, x, y, itemKey, cost) {
        const button = this.add.text(x, y, text, { fontSize: '24px', fill: '#000' })
            .setInteractive()
            .on('pointerdown', () => this.buyDecoration(itemKey, cost));
    }

    buyDecoration(itemKey, cost) {
        if (this.score >= cost && !purchasedDecorations[itemKey]) {
            this.score -= cost;
            this.moneyText.setText(`Money: ${this.score}`);
            this.add.image(400, 300, itemKey).setScale(0.5);
            purchasedDecorations[itemKey] = true;

            // Kaufstatus speichern
            window.localStorage.setItem('purchasedDecorations', JSON.stringify(purchasedDecorations));
        } else if (purchasedDecorations[itemKey]) {
            this.add.text(16, 80, 'Already purchased!', { fontSize: '24px', fill: '#f00' });
        } else {
            this.add.text(16, 80, 'Not enough money!', { fontSize: '24px', fill: '#f00' });
        }
    }

    displayPurchasedDecorations() {
        if (purchasedDecorations.sofa) {
            this.add.image(400, 630, 'sofa').setScale(7);
        }
        if (purchasedDecorations.painting) {
            this.add.image(600, 610, 'painting').setScale(5);
        }
        if (purchasedDecorations.lamp) {
            this.add.image(380, 570, 'lamp').setScale(3);
        }
    }

    createUpgradeButton(text, x, y, onClick) {
        const button = this.add.text(x, y, text, { fontSize: '24px', fill: '#000' })
            .setInteractive()
            .on('pointerdown', onClick);
    }

    goToShopScene() {
        this.scene.start('ShopScene', {
            score: this.score,
            lives: this.playerLives,
            playerJumpHeight: this.playerJumpHeight,
            playerSpeed: this.playerSpeed,
            playerAttackRange: this.playerAttackRange
        });
    }
}

export default DecorScene;
