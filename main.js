import StartMenu from './mainMenu.js';
import GameScene from './gameScene.js';
import GameOver from './gameOver.js';
import Options from './optionScene.js';
import ShopScene from './ShopScene.js';
import DecorScene from './decorScene.js';


var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 750,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    render: {
        pixelArt: true
    },
    scene: [StartMenu, Options, GameScene, GameOver, ShopScene, DecorScene]
};

var game = new Phaser.Game(config);
