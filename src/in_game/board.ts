import * as Phaser from 'phaser';
import AppDefine from "../define/define";
import Block from './block';
import CardData from '../data/card_data';

export default class Board extends Phaser.GameObjects.Container
{
    row_max : number;
    col_max : number;
    bg_blocks : Block[][];
    main_blocks : Block[][];
    preview_blocks : Block[][];

    constructor(scene : Phaser.Scene, row_max : number, col_max : number, block_size : number, is_interactive : boolean)
    {
        super(scene, 0, 0);

        this.row_max = row_max;
        this.col_max = col_max;

        const y_offset = -(row_max * block_size) * 0.5 + (block_size * 0.5);
        const x_offset = -(col_max * block_size) * 0.5 + (block_size * 0.5);

        this.bg_blocks = this.createBoard(Block.BlockType.Empty, block_size, x_offset, y_offset, is_interactive);
        this.main_blocks = this.createBoard(Block.BlockType.None, block_size, x_offset, y_offset, false);
        this.preview_blocks = this.createBoard(Block.BlockType.None, block_size, x_offset, y_offset, false);
    }

    private createBoard(block_type : number, block_size : number, x_offset : number, y_offset :  number , is_interactive : boolean) : Block[][]
    {
        const blocks = [];

        for(let row = 0; row < this.row_max; row++)
        {
            for(let col = 0; col < this.col_max; col++)
            {
                const block = new Block(this.scene, block_type, block_size, row, col, x_offset, y_offset, is_interactive);
                this.add(block);
                
                if(blocks[row] == null)
                {
                    blocks[row] = [];
                }
                blocks[row][col] = block;
            }
        }

        return blocks;
    }

    setCard(x: number, y: number, card_data: CardData)
    {
        for(let row = 0; row < card_data.blocks.length; row++)
        {
            for(let col = 0; col < card_data.blocks[row].length; col++)
            {
                const block_type = card_data.blocks[row][col];

                const set_row = y + row;
                const set_col = x + col;

                if(set_row >= 0 && set_row < this.row_max && set_col >= 0 && set_col < this.col_max)
                {
                    this.main_blocks[set_row][set_col].setBlockType(block_type);
                }
            }
        }
    }

    setHandCard(card_data: CardData)
    {
        // ボードの中心を取得
        const x = Math.floor((this.col_max - 1) * 0.5);
        const y = Math.floor((this.row_max - 1) * 0.5);

        // ブロックが中心に来るように調整
        const x_offset = Math.ceil((card_data.col_max) * 0.5) - 1;
        const y_offset = Math.ceil((card_data.row_max) * 0.5) - 1;

        console.log(x, y);
        console.log(x_offset, y_offset);


        this.setCard(x - x_offset, y - y_offset, card_data);
    }
}