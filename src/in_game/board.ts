import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import Block from './block';
import CardData from '../data/card_data';
import BlockObjectPool from './block_object_pool';

export default class Board extends Phaser.GameObjects.Container
{
    // レイヤータイプ
    static LayerType = {
        Background : 0,
        Main : 1,
        Preview : 2,
    }

    row_max : number;
    col_max : number;

    // ディクショナリ<LayerType,Block[][]>を追加
    blocks_dict :{ [key: number]: Block[][]; } = {};

    // ブロックの描画順を管理する為のコンテナ
    blocks_layer_dict :{ [key: number]: Phaser.GameObjects.Container; } = {};

    current_preview_block_list : Block[];
    preview_object_pool_dict : { [key: number]: BlockObjectPool<Block>; } = {};
    current_block_direction : number;

    cursor_x : number;    // カーソル位置X
    cursor_y : number;    // カーソル位置Y

    private x_offset : number;
    private y_offset : number;

    private block_size : number;

    private is_interactive_board : boolean;

    on_click_board_callback : (x, y) => void;
    on_over_board_callback : (x, y) => void;

    constructor(scene : Phaser.Scene, row_max : number, col_max : number, block_size : number, is_interactive_board : boolean)
    {
        super(scene, 0, 0);

        this.row_max = row_max;
        this.col_max = col_max;

        this.y_offset = -(row_max * block_size) * 0.5 + (block_size * 0.5);
        this.x_offset = -(col_max * block_size) * 0.5 + (block_size * 0.5);

        this.block_size = block_size;

        this.is_interactive_board = is_interactive_board;

        this.blocks_layer_dict =
        {
            [Board.LayerType.Background] : new Phaser.GameObjects.Container(this.scene, 0, 0),
            [Board.LayerType.Main] : new Phaser.GameObjects.Container(this.scene, 0, 0),
            [Board.LayerType.Preview] : new Phaser.GameObjects.Container(this.scene, 0, 0),
        };
        this.add(this.blocks_layer_dict[Board.LayerType.Background]);
        this.add(this.blocks_layer_dict[Board.LayerType.Main]);
        this.add(this.blocks_layer_dict[Board.LayerType.Preview]);
        

        this.blocks_dict =
        {
            [Board.LayerType.Background] : this.createBoard(Board.LayerType.Background, Block.BlockType.Empty),
            [Board.LayerType.Main] : this.createBoard(Board.LayerType.Main, Block.BlockType.None),
            [Board.LayerType.Preview] : this.createBoard(Board.LayerType.Preview, Block.BlockType.None),
        };

        //this.current_preview_block_list = null;
        this.preview_object_pool_dict = 
        {
            [Block.BlockType.Normal] : new BlockObjectPool<Block>(),
            [Block.BlockType.Special] : new BlockObjectPool<Block>(),
        };


        this.current_block_direction = AppDefine.Direction.Up;

        // マウスホイールでブロックを回転させる為のイベントを登録
        this.scene.input.on('wheel', this.onWheel, this);
    }

    private createBoard = (layer_type : number , fill_block_type : number) : Block[][] =>
    {
        const blocks = [];

        for(let row = 0; row < this.row_max; row++)
        {
            for(let col = 0; col < this.col_max; col++)
            {
                let block = null;
                
                // Noneの場合はブロックを作成しない
                if(fill_block_type != Block.BlockType.None)
                {
                    block = this.createBlock(layer_type, fill_block_type, row, col);
                }
                
                if(blocks[row] == null)
                {
                    blocks[row] = [];
                }
                blocks[row][col] = block;
            }
        }

        return blocks;
    }

    private clearBoard = (layer_type : number, fill_block_type) : void =>
    {
        const blocks = this.blocks_dict[layer_type];

        for(let row = 0; row < blocks.length; row++)
        {
            for(let col = 0; col < blocks[row].length; col++)
            {
                const block = blocks[row][col];

                if(block == null) continue;

                block.setBlockType(fill_block_type);
            }
        }
    }

    createBlock = (layer_type : number, block_type : number, row : number, col : number) : Block =>
    {
        const is_interactive = (layer_type == Board.LayerType.Background) && this.is_interactive_board;
        const is_preview = (layer_type == Board.LayerType.Preview);

        const block = new Block(this.scene, block_type, this.block_size, row, col, this.x_offset, this.y_offset, is_interactive, is_preview);
        this.blocks_layer_dict[layer_type].add(block);
        block.on_click_callback = this.onClickBoard;
        block.on_over_callback = this.onOverBoard;

        return block;
    }

    setBlocks = (layer_type : number, x: number, y: number, blocks : number[][]) : Block[] =>
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
                    const block = this.getBlock(layer_type, set_col, set_row);

                    block.setBlockType(block_type);
                    update_block_list.push(block);
                }
            }
        }

        return update_block_list;
    }

    getBlock = (layer_type : number, x: number, y: number) : Block =>
    {
        const target_blocks = this.blocks_dict[layer_type];

        if(!target_blocks[y][x])
        {
            target_blocks[y][x] = this.createBlock(layer_type, Block.BlockType.None, y, x);
        }

        return target_blocks[y][x];
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

        this.clearBoard(Board.LayerType.Preview, Block.BlockType.Empty);
        this.setBlocks(Board.LayerType.Main, x - x_offset, y - y_offset, card_data.getBlocks(direction));
    }

    setPreviewCard = (x: number, y: number, card_data: CardData) =>
    {
        console.log("setPreviewCard : " + x + ", " + y);
/*
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

        this.current_preview_block_list = this.setBlocks(Board.LayerType.Preview, x - x_offset, y - y_offset, card_data.getBlocks(this.current_block_direction));
*/
    }

    setBoardCard = (x: number, y: number, card_data: CardData) =>
    {
        console.log("setBoardCard : " + x + ", " + y);

        // ブロックが中心に来るように調整
        const x_offset = Math.ceil((card_data.getColMax(this.current_block_direction)) * 0.5) - 1;
        const y_offset = Math.ceil((card_data.getRowMax(this.current_block_direction)) * 0.5) - 1;

        this.setBlocks(Board.LayerType.Main, x - x_offset, y - y_offset, card_data.getBlocks(this.current_block_direction));
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