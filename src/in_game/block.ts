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
    constructor(scene : Phaser.Scene, block_type : number, row : number, col :number, x_offset : number, y_offset : number)
    {
        const x = row * AppDefine.BoardBlockSize + x_offset;
        const y = col * AppDefine.BoardBlockSize + y_offset;
        const width = AppDefine.BoardBlockSize;
        const height = AppDefine.BoardBlockSize;
        
        let fillColor = AppDefine.BoardFillColor;
        let fillAlpha = 1;

        super(scene, x, y, width, height, fillColor, fillAlpha);

        this.row = row;
        this.col = col;

        if(block_type == Block.BlockType.Empty)
        {
            // ブロックがクリックされた時の処理を追加
            this.setInteractive();
            this.on('pointerdown', this.onPointerDown, this);
        }
    }

    // ブロックがクリックされた時の処理
    onPointerDown()
    {
        console.log("row:" + this.row + " col:" + this.col);
    }

}