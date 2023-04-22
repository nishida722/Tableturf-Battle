import * as Phaser from 'phaser';
import AppDefine from "../define/define";
import Block from './block';
import CardData from '../data/card_data';

export default class Board extends Phaser.GameObjects.Container
{
    row_max : number;
    col_max : number;
    blocks : Block[][];

    constructor(scene : Phaser.Scene, row_max : number, col_max : number, block_size : number, is_interactive : boolean)
    {
        super(scene, 0, 0);

        this.row_max = row_max;
        this.col_max = col_max;
        this.blocks = [];

        const y_offset = -(row_max * block_size) * 0.5 + (block_size * 0.5);
        const x_offset = -(col_max * block_size) * 0.5 + (block_size * 0.5);

        for(let row = 0; row < row_max; row++)
        {
            for(let col = 0; col < col_max; col++)
            {
                const block = new Block(this.scene, Block.BlockType.Empty, block_size, row, col, x_offset, y_offset, is_interactive);
                block.setStrokeStyle(1, AppDefine.BoardStrokeColor);
                this.add(block);

                if(this.blocks[row] == null)
                {
                    this.blocks[row] = [];
                }
                this.blocks[row][col] = block;
            }
        }
    }

    setCard(x: number, y: number, card_data: CardData)
    {
        for(let row = 0; row < this.row_max; row++)
        {
            for(let col = 0; col < this.col_max; col++)
            {
                const block_type = card_data.blocks[row][col];
                this.blocks[row][col].setBlockType(block_type);
            }
        }
    }
}