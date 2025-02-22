import StartMenu from './scenes/mainMenu.js';
import GameScene from './scenes/gameScene.js';
import GameOver from './scenes/gameOver.js';
import Options from './scenes/optionScene.js';
import ShopScene from './scenes/ShopScene.js';
import DecorScene from './scenes/decorScene.js';


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
