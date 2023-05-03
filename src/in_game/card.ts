import * as Phaser from 'phaser';
import Board from './board';
import CardData from '../data/card_data';
import Block from './block';
import AppDefine from '../define/app_define';

export default class Card extends Phaser.GameObjects.Container
{
    card_data : CardData;

    on_click : (card : Card) => void;

    mask_graphics : Phaser.GameObjects.Graphics;

    constructor(scene : Phaser.Scene, card_data : CardData)
    {
        super(scene, 0, 0);

        this.card_data = card_data;

        // カードのような見た目を作る
        const card_width = AppDefine.BaseCardWidth;
        const card_height = AppDefine.BaseCardHeight;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(bg_graphics);
        bg_graphics.fillStyle(0xcccccc, 1);
        bg_graphics.fillRoundedRect(-card_width * 0.5, -card_height * 0.5, card_width, card_height, 10);
        bg_graphics.setInteractive(new Phaser.Geom.Rectangle(-card_width * 0.5, -card_height * 0.5, card_width, card_height), Phaser.Geom.Rectangle.Contains);
        bg_graphics.on('pointerdown', () => {
           if(this.on_click) this.on_click(this);
        });
        
        // ボードを作成
        const board = new Board(scene, 8, 8, 15, false);
        board.setHandCard(card_data);
        this.add(board);
        Phaser.Display.Align.In.Center(board, this, 0, -25);

        const block_num_width = 40;
        const block_num_height = 40;

        const block_num_pos_x = -card_width * 0.5 + block_num_width * 0.5 + 5;
        const block_num_pos_y = card_height * 0.5 - block_num_height * 0.5 - 5;

        const block_num = new Phaser.GameObjects.Container(this.scene);
        block_num.setPosition(block_num_pos_x, block_num_pos_y);
        this.add(block_num);

        const block_num_bg = new Phaser.GameObjects.Graphics(this.scene);
        block_num_bg.fillStyle(0x000000, 1);
        block_num_bg.fillRoundedRect(-block_num_width * 0.5, -block_num_height * 0.5, block_num_width, block_num_height, 10);
        block_num.add(block_num_bg);

        // ブロック数を表示
        const block_num_text = new Phaser.GameObjects.Text(this.scene, 0, 0, card_data.block_num.toString(), { color: '#ffffff', fontSize: '28px' ,fontFamily: AppDefine.DefaultFontFamily});
        block_num_text.setOrigin(0.5);
        block_num.add(block_num_text);

        // SPポイント表示
        const sp_point = new Phaser.GameObjects.Container(this.scene);
        sp_point.setPosition(-10, 50);
        this.add(sp_point);

        const sp_point_block_size = 10;
        const sp_point_block_list = [];
        for (let col = 0; col < card_data.sp_point; col++)
        {
            const sp_point_block = new Block(this.scene, Block.BlockType.Special, sp_point_block_size, 0, col, 0, 0, false, false);
            sp_point.add(sp_point_block);
            sp_point_block_list.push(sp_point_block);
        }

        Phaser.Actions.GridAlign(sp_point_block_list, {
			width: 6,
			height: 2,
			cellWidth: sp_point_block_size + 3,
			cellHeight: sp_point_block_size + 3,
		});

        this.mask_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(this.mask_graphics);

        this.setSelect(false);
    }

    // カードを選択状態にする
    setSelect = (is_select : boolean) =>
    {
        if(is_select)
        {
            this.mask_graphics.clear();
            this.mask_graphics.fillStyle(0x000000, 0);
            this.mask_graphics.fillRoundedRect(-AppDefine.BaseCardWidth * 0.5, -AppDefine.BaseCardHeight * 0.5, AppDefine.BaseCardWidth, AppDefine.BaseCardHeight, 10);
        }
        else
        {
            this.mask_graphics.clear();
            this.mask_graphics.fillStyle(0x000000, 0.4);
            this.mask_graphics.fillRoundedRect(-AppDefine.BaseCardWidth * 0.5, -AppDefine.BaseCardHeight * 0.5, AppDefine.BaseCardWidth, AppDefine.BaseCardHeight, 10);
        }
    }
}