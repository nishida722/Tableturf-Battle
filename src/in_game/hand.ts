import * as Phaser from 'phaser';
import Card from './card';
import CardData from '../data/card_data';

export default class Hand extends Phaser.GameObjects.Container
{
    card_data_list : CardData[];

    constructor(scene : Phaser.Scene)
    {
        super(scene, 0, 0);

        // カードのような見た目を作る
        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        bg_graphics.fillStyle(0x000000, 0.5);
        bg_graphics.fillRoundedRect(-200, -300, 400, 500, 10);
        this.add(bg_graphics);

        this.card_data_list = [];
    }

    addCard(...card_data : CardData[])
    {
        this.card_data_list.push(...card_data);

        const card = new Card(this.scene, card_data[0]);
        this.add(card);
    }
}