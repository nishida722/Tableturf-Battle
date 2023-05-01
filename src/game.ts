import * as Phaser from 'phaser';
import AppDefine from './define/app_define';
import Quiz from './in_game/quiz_scene';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: AppDefine.SIZE_WIDTH_SCREEN,
        height: AppDefine.SIZE_HEIGHT_SCREEN,
    },
    scene: [Quiz]
};

const game = new Phaser.Game(config);
