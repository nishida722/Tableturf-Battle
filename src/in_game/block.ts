import * as Phaser from 'phaser';
import AppDefine from "../define/define";

export default class Block extends Phaser.GameObjects.Rectangle
{
    // ブロックのタイプ
    static readonly BlockType = {
        None : 0,
        Empty : 1,
        Normal : 2,
        Special : 3,
    };

    // メンバ変数row colを追加
    row : number;
    col : number;

    //constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number, fillColor : number, fillAlpha : number)
    constructor(scene : Phaser.Scene, block_type : number, block_size : number, row : number, col :number, x_offset : number, y_offset : number, is_interactive : boolean)
    {
        const y = row * block_size + x_offset;
        const x = col * block_size + y_offset;
        const width = block_size;
        const height = block_size;
        
        super(scene, x, y, width, height);
        this.setBlockType(block_type);

        this.row = row;
        this.col = col;

        if(is_interactive)
        {
            // ブロックがクリックされた時の処理を追加
            this.setInteractive();
            this.on('pointerdown', this.onPointerDown, this);
        }
    }

    setBlockType(block_type : number)
    {
        switch(block_type)
        {
            case Block.BlockType.None:
                this.setFillStyle(0x000000, 0);
                this.setStrokeStyle(1, 0x000000, 0);
                break;
            case Block.BlockType.Empty:
                this.setFillStyle(0x000000, 1);
                this.setStrokeStyle(1, 0xffffff, 1);
                break;
            case Block.BlockType.Normal:
                this.setFillStyle(0xffff00, 1);
                this.setStrokeStyle(1, 0xffffff, 1);
                break;
            case Block.BlockType.Special:
                this.setFillStyle(0xffa500, 1);
                this.setStrokeStyle(1, 0xffffff, 1);
                break;
        }
    }

    // ブロックがクリックされた時の処理
    onPointerDown()
    {
        console.log("row:" + this.row + " col:" + this.col);
    }

}