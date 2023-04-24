import * as Phaser from 'phaser';
import AppDefine from './define/app_define';
import InGame from './in_game/in_game_scene';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        width: AppDefine.GameWidth,
        height: AppDefine.GameHeight,
    },
    scene: InGame
};

const game = new Phaser.Game(config);
