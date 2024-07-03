class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bottle', 'assets/bottle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('backgroundMusic', 'assets/soundtrack.wav');
        this.load.audio('whoosh', 'assets/whoosh.wav');
    }

    create() {
        this.add.image(500, 375, 'bg');
        this.counter = 0;

        // Festlegung von Startwerten für min und max
        this.initialMin = 5000;
        this.initialMax = 10000;
        this.minSpawnDelay = 5000;
        this.maxSpawnDelay = 10000;

        // Deklaration und Initialisierung der platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(1000, 825, 'ground').setScale(5).refreshBody();

        // Zeitverzögertes Event zum Spawnen des Feindes mit festem Startintervall
        this.spawnEnemyEvent();
        this.spawnBottleEvent();

        // Spieler-Charakter
        this.player = this.physics.add.sprite(300, 450, 'dude');
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(10);

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

        this.anims.create({
            key: 'attack1',
            frames: this.anims.generateFrameNumbers('dude', { start: 14, end: 14 }),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'attack2',
            frames: this.anims.generateFrameNumbers('dude', { start: 15, end: 15 }),
            frameRate: 1,
            repeat: 0
        });

        this.player.anims.play('idle');

        // Steuerung
        this.cursors = this.input.keyboard.createCursorKeys();

        // Hintergrundmusik
        this.music = this.sound.add('backgroundMusic');
        this.music.play({
            loop: true
        });

        // Punkteanzeige
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.counterText = this.add.text(16, 48, 'Time: 0', { fontSize: '32px', fill: '#000' });

        // Kollision zwischen Spieler und Plattformen
        this.physics.add.collider(this.player, this.platforms);

        // Timer-Event für das Inkrementieren des Zählers und Debug-Ausgabe von min
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.incrementCounter(); // Zähler inkrementieren
            },
            callbackScope: this,
            loop: true
        });

        // Debug-Ansicht der Hitboxen einschalten
        this.physics.world.createDebugGraphic();
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff00ff, 1);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Spieler-Steuerung
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
            this.player.anims.play('left', true);
            this.direction = "left";
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
            this.player.anims.play('right', true);
            this.direction = "right";
        } else if ((this.cursors.down.isDown) && (this.direction == "right")) {
            this.player.setVelocityX(0);
            this.player.anims.play('attack1', true);
            let hitbox = this.createHitbox(this.player.x + 200, this.player.y).setScale(5);
        } else if ((this.cursors.down.isDown) && (this.direction == "left")) {
            var whoosh = this.sound.add('whoosh');
            whoosh.play();
            this.player.setVelocityX(0);
            this.player.anims.play('attack2', true);
            let hitbox = this.createHitbox(this.player.x - 200, this.player.y).setScale(5);
        } else {
            this.player.setVelocityX(0);
            if (!this.player.anims.currentAnim || this.player.anims.currentAnim.key !== 'idle') {
                this.player.anims.play('idle', true);
            }
        }

        // Sprung
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
        }

        // Überprüfung der Kollision basierend auf der x-Koordinate
        if (this.movingObject && Math.abs(this.player.x - this.movingObject.x) < 10) {
            this.scene.start('GameOver');
        }

        // Hitboxen debuggen
        this.debugGraphics.clear();
        this.debugGraphics.strokeRectShape(this.player.getBounds());
        if (this.movingObject) {
            this.debugGraphics.strokeRectShape(this.movingObject.getBounds());
        }
    }

    // Erstellen einer Hitbox
    createHitbox(x, y) {
        if (this.hitbox) {
            this.hitbox.destroy();
        }

        this.hitbox = this.physics.add.sprite(x, y, null).setSize(32, 32);
        this.hitbox.setVisible(false);
        this.hitbox.body.allowGravity = false;

        this.time.delayedCall(200, () => {
            if (this.hitbox) {
                this.hitbox.destroy();
            }
            this.player.anims.play('idle');
        }, [], this);

        if (this.movingObject) {
            this.physics.add.overlap(this.hitbox, this.movingObject, this.handleCollision, null, this);
        }

        return this.hitbox;
    }

    // Spawning des Feindes
    spawnEnemy(scene, x, y) {
        var difficulty = this.counter / 2;
        var spawnDirection = Phaser.Math.Between(0, 1);
    
        var xPos = spawnDirection === 0 ? 0 : 1000;
        var velocityX = spawnDirection === 0 ? (300 + difficulty) : -(300 + difficulty);
    
        this.movingObject = scene.physics.add.sprite(xPos, 600, 'movingObject');
        this.movingObject.body.allowGravity = false;
        this.movingObject.setCollideWorldBounds(false);
        this.movingObject.setVelocityX(velocityX);
        this.movingObject.setScale(10);
    
        console.log("Enemy Velocity: " + this.movingObject.body.velocity.x);
        console.log("minSpawn: " + this.minSpawnDelay)
        console.log("maxSpawn: " + this.maxSpawnDelay)
        this.minSpawnDelay = this.minSpawnDelay /1.01
        this.maxSpawnDelay = this.maxSpawnDelay /1.01



    
        // Überprüfen, ob die Animation bereits existiert
        if (!scene.anims.get('enemy_anim')) {
            // Animation erstellen, wenn sie nicht existiert
            scene.anims.create({
                key: 'enemy_anim',
                frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        // Animation auf dem Sprite anwenden und spiegeln
        this.movingObject.anims.play('enemy_anim', true);
        if (spawnDirection === 1) {
            this.movingObject.flipX = true;
        }
    
        // Überlappung der Hitbox und Kollision mit dem Spieler hinzufügen
        if (this.hitbox) {
            scene.physics.add.overlap(this.hitbox, this.movingObject, this.handleCollision, null, scene);
        }
    
        this.physics.add.overlap(this.player, this.movingObject, this.playerHit, null, this);
    
        return this.movingObject;
    }

    // Spawning der Flasche
    spawnBottle(scene, x, y) {
        var difficulty = this.counter / 2;

        // Festlegen der Startposition der Flasche am oberen Bildschirmrand
        var xPos = Phaser.Math.Between(0, scene.sys.canvas.width);
        var yPos = 0;

        // Geschwindigkeit der Flasche von oben nach unten
        var velocityX = 0;
        var velocityY = 200 + difficulty; // Schneller als der Feind, aber langsamer als der Spieler

        this.bottle = scene.physics.add.sprite(xPos, yPos, 'bottle');
        this.bottle.body.allowGravity = false;
        this.bottle.setCollideWorldBounds(false);
        this.bottle.setVelocity(velocityX, velocityY);
        this.bottle.setScale(5);

        console.log("Bottle Velocity: "+ this.bottle.body.velocity.y);

        if (!scene.anims.get('bottle')) {
            // Animation erstellen, wenn sie nicht existiert
            scene.anims.create({
                key: 'bottle',
                frames: scene.anims.generateFrameNumbers('bottle', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Kollision des Spielers mit der Flasche überwachen
        this.physics.add.overlap(this.player, this.bottle, this.playerHit, null, this);

        return this.bottle;
    }

    // Zähler erhöhen
    incrementCounter() {
        this.counter++;
        this.counterText.setText('Points: ' + this.counter);
    }

    // Kollision behandeln
    handleCollision(hitbox, movingObject) {
        if (this.direction == 'left') {
            movingObject.setVelocityX(-500);
        } else {
            movingObject.setVelocityX(500);
        }

        console.log('Enemy destroyed!');
    }

    // Spieler-Kollision behandeln
    playerHit(player, object) {
        if (object === this.movingObject && Math.abs(player.x - object.x) < 10) {
            this.scene.start('GameOver');
        } else if (object === this.bottle && Math.abs(player.x - object.x) < 10) {
            this.scene.start('GameOver');
        }
    }

    // Zeitereignis für das Spawnen des Feindes
    spawnEnemyEvent() {
        this.time.addEvent({
            delay: Phaser.Math.Between(this.minSpawnDelay, this.maxSpawnDelay),
            callback: () => {
                this.spawnEnemy(this, Phaser.Math.Between(0, 1000), Phaser.Math.Between(0, 500));
                this.spawnEnemyEvent();
            },
            callbackScope: this
        });
    }

    // Zeitereignis für das Spawnen der Flasche
    spawnBottleEvent() {
        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 15000),
            callback: () => {
                this.spawnBottle(this, Phaser.Math.Between(0, 1000), Phaser.Math.Between(0, 500));
                this.spawnBottleEvent();
            },
            callbackScope: this
        });
    }
}

export default GameScene;
