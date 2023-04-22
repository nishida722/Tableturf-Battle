import * as Phaser from 'phaser';
import Board from './board';
import CardData from '../data/card_data';

export default class Card extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene, card_data : CardData)
    {
        super(scene, 0, 0);

        // カードのような見た目を作る
        const card_width = 130;
        const card_height = 180;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        bg_graphics.fillStyle(0xcccccc, 1);
        bg_graphics.fillRoundedRect(-card_width * 0.5, -card_height * 0.5, card_width, card_height, 10);
        this.add(bg_graphics);
        
        // ボードを作成
        const board = new Board(scene, 8, 8, 15, false);
        this.add(board);
        Phaser.Display.Align.In.Center(board, this, 0, -25);

        board.setCard(0, 0, card_data);
    }
}