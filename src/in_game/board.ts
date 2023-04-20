import * as Phaser from 'phaser';
import AppDefine from "../define/define";
import Block from './block';

export default class Board extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene)
    {
        super(scene, 0, 0);

        const row_max = 20;
        const col_max = 20;

        const x_offset = -(row_max * AppDefine.BoardBlockSize) * 0.5 + (AppDefine.BoardBlockSize * 0.5);
        const y_offset = -(col_max * AppDefine.BoardBlockSize) * 0.5 + (AppDefine.BoardBlockSize * 0.5);

        const x_bg_size = (row_max * AppDefine.BoardBlockSize) * 1.05;
        const y_bg_size = (col_max * AppDefine.BoardBlockSize) * 1.05;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        bg_graphics.fillStyle(0xffffff, 1);
        bg_graphics.fillRoundedRect(-(x_bg_size * 0.5), -(y_bg_size * 0.5), x_bg_size, y_bg_size, 32);
        this.add(bg_graphics);

        for(let row = 0; row < row_max; row++)
        {
            for(let col = 0; col < col_max; col++)
            {
                const block = new Block(this.scene, Block.BlockType.Empty, row, col, x_offset, y_offset);
                block.setStrokeStyle(1, AppDefine.BoardStrokeColor);
                this.add(block);
            }
        }


    }
}