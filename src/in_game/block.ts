import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";

export default class Block extends Phaser.GameObjects.Container
{
    // ブロックのタイプ
    static readonly BlockType = {
        None : 0,
        Empty : 1,
        Normal : 2,
        Special : 3,
    };

    bg_graphics : Phaser.GameObjects.Rectangle;
    stripe : Phaser.GameObjects.Shader;
    dots : Phaser.GameObjects.Shader;
    is_preview : boolean;

    block_size : number;

    // メンバ変数row colを追加
    row : number;
    col : number;

    on_click_callback : (x, y) => void;
    on_over_callback : (x, y) => void;

    constructor(scene : Phaser.Scene, block_type : number, block_size : number, row : number, col :number, x_offset : number, y_offset : number, is_interactive : boolean, is_preview : boolean)
    {        
        super(scene, 0, 0);
        const y = row * block_size + x_offset;
        const x = col * block_size + y_offset;
        this.block_size = block_size;
        this.row = row;
        this.col = col;
        this.is_preview = is_preview;

        this.setPosition(x, y);

        this.bg_graphics = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, block_size, block_size, 0x000000);
        this.add(this.bg_graphics);

        if(is_interactive)
        {
            // ブロックがクリックされた時の処理を追加
            this.bg_graphics.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.block_size, this.block_size), Phaser.Geom.Rectangle.Contains);
            this.bg_graphics.on('pointerdown', this.onPointerDown, this);

            // ブロックがマウスオーバーされた時の処理を追加
            this.bg_graphics.on('pointerover', this.onPointerOver, this);
        }

        this.setBlockType(block_type);
    }

    setBlockType = (block_type : number) =>
    {
        // 使用しないプレビュー用の表示がある場合は削除
        if(this.stripe && (!this.is_preview || block_type != Block.BlockType.Normal))
        {
            this.remove(this.stripe, true);
            this.stripe = null;
        }
        if(this.dots && (!this.is_preview || block_type != Block.BlockType.Special))
        {
            this.remove(this.dots, true);
            this.dots = null;
        }

        switch(block_type)
        {
            case Block.BlockType.None:
                this.bg_graphics.setFillStyle(0x000000, 0);
                this.bg_graphics.setStrokeStyle(1, 0x000000, 0);
                break;
            case Block.BlockType.Empty:
                this.bg_graphics.setFillStyle(0x000000, 1);
                this.bg_graphics.setStrokeStyle(1, 0x808080, 1);
                break;
            case Block.BlockType.Normal:
                this.bg_graphics.setFillStyle(0xffff00, (this.is_preview) ? 0 : 1);
                this.bg_graphics.setStrokeStyle(1, 0x808080, 1);

                if(this.is_preview && !this.stripe)
                {
                    this.stripe = new Phaser.GameObjects.Shader(this.scene, 'White Stripes', 0, 0, this.block_size, this.block_size);
                    this.add(this.stripe);
                }
                break;
            case Block.BlockType.Special:
                this.bg_graphics.setFillStyle(0xffa500, (this.is_preview) ? 0 : 1);
                this.bg_graphics.setStrokeStyle(1, 0x808080, 1);

                if(this.is_preview && !this.dots)
                {
                    this.dots = new Phaser.GameObjects.Shader(this.scene, 'White Dots', 0, 0, this.block_size, this.block_size);
                    this.add(this.dots);
                }
                break;
        }
    }

    // ブロックがクリックされた時の処理
    onPointerDown = () =>
    {
        this.on_click_callback(this.col, this.row);
    }

    // ブロックがマウスオーバーされた時の処理
    onPointerOver = () =>
    {
        this.on_over_callback(this.col, this.row);
    }

}