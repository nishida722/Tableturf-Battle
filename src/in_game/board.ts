import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import Block from './block';
import CardData from '../data/card_data';

export default class Board extends Phaser.GameObjects.Container
{
    row_max : number;
    col_max : number;
    bg_blocks : Block[][];
    main_blocks : Block[][];
    preview_blocks : Block[][];

    current_preview_block_list : Block[];
    current_block_direction : number;

    cursor_x : number;    // カーソル位置X
    cursor_y : number;    // カーソル位置Y

    on_click_board_callback : (x, y) => void;
    on_over_board_callback : (x, y) => void;

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

        this.current_preview_block_list = null;
        this.current_block_direction = AppDefine.Direction.Up;

        // マウスホイールでブロックを回転させる為のイベントを登録
        this.scene.input.on('wheel', this.onWheel, this);
    }

    private createBoard = (block_type : number, block_size : number, x_offset : number, y_offset :  number , is_interactive : boolean) : Block[][] =>
    {
        const blocks = [];

        for(let row = 0; row < this.row_max; row++)
        {
            for(let col = 0; col < this.col_max; col++)
            {
                const block = new Block(this.scene, block_type, block_size, row, col, x_offset, y_offset, is_interactive);
                block.on_click_callback = this.onClickBoard;
                block.on_over_callback = this.onOverBoard;
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

    setBlocks = (x: number, y: number, blocks : number[][], target_blocks : Block[][]) : Block[] =>
    {
        const update_block_list : Block[] = [];
        
        for(let row = 0; row < blocks.length; row++)
        {
            for(let col = 0; col < blocks[row].length; col++)
            {
                const block_type = blocks[row][col];

                // 空ブロックは無視
                if(block_type < Block.BlockType.Normal) continue;

                const set_row = y + row;
                const set_col = x + col;

                if(set_row >= 0 && set_row < this.row_max && set_col >= 0 && set_col < this.col_max)
                {
                    target_blocks[set_row][set_col].setBlockType(block_type);
                    update_block_list.push(target_blocks[set_row][set_col]);
                }
            }
        }

        return update_block_list;
    }

    setHandCard = (card_data: CardData) =>
    {
        // ボードの中心を取得
        const x = Math.floor((this.col_max - 1) * 0.5);
        const y = Math.floor((this.row_max - 1) * 0.5);

        const direction = AppDefine.Direction.Up;

        // ブロックが中心に来るように調整
        const x_offset = Math.ceil((card_data.getColMax(direction)) * 0.5) - 1;
        const y_offset = Math.ceil((card_data.getRowMax(direction)) * 0.5) - 1;

        this.setBlocks(x - x_offset, y - y_offset, card_data.getBlocks(direction), this.main_blocks);
    }

    setPreviewCard = (x: number, y: number, card_data: CardData) =>
    {
        console.log("setPreviewCard : " + x + ", " + y);

        // プレビュー表示中のブロックをクリア
        if(this.current_preview_block_list)
        {
            for(let i = 0; i < this.current_preview_block_list.length; i++)
            {
                this.current_preview_block_list[i].setBlockType(Block.BlockType.None);
            }

            this.current_preview_block_list = null;
        }

        // ブロックが中心に来るように調整
        const x_offset = Math.ceil((card_data.getColMax(this.current_block_direction)) * 0.5) - 1;
        const y_offset = Math.ceil((card_data.getRowMax(this.current_block_direction)) * 0.5) - 1;

        this.current_preview_block_list = this.setBlocks(x - x_offset, y - y_offset, card_data.getBlocks(this.current_block_direction), this.preview_blocks);
    }

    setBoardCard = (x: number, y: number, card_data: CardData) =>
    {
        console.log("setBoardCard : " + x + ", " + y);

        // ブロックが中心に来るように調整
        const x_offset = Math.ceil((card_data.getColMax(this.current_block_direction)) * 0.5) - 1;
        const y_offset = Math.ceil((card_data.getRowMax(this.current_block_direction)) * 0.5) - 1;

        this.setBlocks(x - x_offset, y - y_offset, card_data.getBlocks(this.current_block_direction), this.main_blocks);
    }

    onClickBoard = (x : number, y : number) =>
    {
        console.log("onClickBoard : " + x + ", " + y);

        this.cursor_x = x;
        this.cursor_y = y;

        if(this.on_click_board_callback) this.on_click_board_callback(x, y);
    }

    onOverBoard = (x : number, y : number) =>
    {
        console.log("onOverBoard : " + x + ", " + y);

        this.cursor_x = x;
        this.cursor_y = y;

        if(this.on_over_board_callback) this.on_over_board_callback(x, y);
    }

    onWheel = (pointer : Phaser.Input.Pointer, game_objects : Phaser.GameObjects.GameObject[], delta_x : number, delta_y : number, delta_z : number) =>
    {
        // this.current_block_direction をホイールで回転させる
        if(delta_y > 0)
        {
            this.current_block_direction = (this.current_block_direction + 1) % 4;
        }
        else if(delta_y < 0)
        {
            this.current_block_direction = (this.current_block_direction - 1 + 4) % 4;
        }

        // プレビューを更新するためにカーソルオーバー時の処理を呼ぶ
        this.onOverBoard(this.cursor_x, this.cursor_y);
    }

}