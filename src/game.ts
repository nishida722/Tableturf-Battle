import * as Phaser from 'phaser';
import AppDefine from './define';

export default class Demo extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.zone = this.add.zone(AppDefine.GameWidth * 0.5, AppDefine.GameHeight * 0.5, AppDefine.GameWidth, AppDefine.GameHeight);
        //this.load.image('logo', 'assets/phaser3-logo.png');
        //this.load.image('libs', 'assets/libs.png');
        //this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        //this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create ()
    {
        this.drawBoard();
    }

    drawBoard()
    {
        const board = this.add.container(0, 0);
        Phaser.Display.Align.In.Center(board, this.zone);

        const row_max = 20;
        const col_max = 20;

        const x_offset = -(row_max * AppDefine.BoardBlockSize) * 0.5;
        const y_offset = -(col_max * AppDefine.BoardBlockSize) * 0.5;

        for(let row = 0; row < row_max; row++)
        {
            for(let col = 0; col < col_max; col++)
            {
                const block = this.add.rectangle(row * AppDefine.BoardBlockSize + x_offset, col * AppDefine.BoardBlockSize + y_offset, AppDefine.BoardBlockSize, AppDefine.BoardBlockSize, AppDefine.BoardFillColor);
                block.setStrokeStyle(1, AppDefine.BoardStrokeColor);

                board.add(block);
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: AppDefine.GameWidth,
    height: AppDefine.GameHeight,
    scene: Demo
};

const game = new Phaser.Game(config);
