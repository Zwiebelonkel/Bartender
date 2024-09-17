class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.score = data.score;
        this.playerLives = data.lives;
        this.playerJumpHeight = data.playerJumpHeight;
        this.playerSpeed = data.playerSpeed;
        this.playerAttackRange = data.playerAttackRange;
    }

    preload() {
        this.load.image('shop', 'shop.png');
    }

    create() {
        this.add.image(500, 375, 'shop');
        this.add.text(16, 16, 'Shop', { fontSize: '32px', fill: '#000' });
        this.moneyText = this.add.text(16, 48, `Money: ${this.score}`, { fontSize: '32px', fill: '#000' });

        this.createUpgradeButton('More Lives - 500$', 100, 100, () => this.buyUpgrade('lives', 1, 500));
        this.createUpgradeButton('Higher Jump - 2000$', 100, 150, () => this.buyUpgrade('jump', -100, 2000));
        this.createUpgradeButton('More Speed - 1500$', 100, 200, () => this.buyUpgrade('speed', 100, 1500));
        this.createUpgradeButton('Back to Game', 100, 300, () => this.backToGame());
    }

    createUpgradeButton(text, x, y, onClick) {
        const button = this.add.text(x, y, text, { fontSize: '24px', fill: '#000' })
            .setInteractive()
            .on('pointerdown', onClick);
    }

    buyUpgrade(type, value, cost) {
        if (this.score >= cost) {
            this.score -= cost;
            this.moneyText.setText(`Money: ${this.score}`);

            if (type === 'lives') {
                this.playerLives += value;
            } else if (type === 'jump') {
                this.playerJumpHeight += value;
            } else if (type === 'speed') {
                this.playerSpeed += value;
            } else if (type === 'range') {
                this.playerAttackRange += value;
            }
        }
    }

    backToGame() {
        this.scene.start('GameScene', {
            score: this.score,
            lives: this.playerLives,
            playerJumpHeight: this.playerJumpHeight,
            playerSpeed: this.playerSpeed,
            playerAttackRange: this.playerAttackRange
        });
    }
}

export default ShopScene;
