import * as Phaser from 'phaser';
import Board from './board';
import CardData from '../data/card_data';
import Block from './block';
import AppDefine from '../define/define';

export default class Card extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene, card_data : CardData)
    {
        super(scene, 0, 0);

        // カードのような見た目を作る
        const card_width = AppDefine.BaseCardWidth;
        const card_height = AppDefine.BaseCardHeight;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        bg_graphics.fillStyle(0xcccccc, 1);
        bg_graphics.fillRoundedRect(-card_width * 0.5, -card_height * 0.5, card_width, card_height, 10);
        this.add(bg_graphics);
        
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
        const block_num_text = new Phaser.GameObjects.Text(this.scene, 0, 0, card_data.block_num.toString(), { color: '#ffffff', fontSize: '28px' });
        block_num_text.setOrigin(0.5);
        block_num.add(block_num_text);

        // SPポイント表示
        const sp_point = new Phaser.GameObjects.Container(this.scene);
        sp_point.setPosition(-15, 50);
        this.add(sp_point);

        const sp_point_block_size = 10;
        const sp_point_block_list = [];
        for (let col = 0; col < card_data.sp_point; col++)
        {
            const sp_point_block = new Block(this.scene, Block.BlockType.Special, sp_point_block_size, 0, col, 0, 0, false);
            sp_point.add(sp_point_block);
            sp_point_block_list.push(sp_point_block);
        }

        Phaser.Actions.GridAlign(sp_point_block_list, {
			width: 6,
			height: 2,
			cellWidth: sp_point_block_size + 2,
			cellHeight: sp_point_block_size + 2,
		});
    }
}