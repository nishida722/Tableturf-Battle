import * as Phaser from 'phaser';
import Card from './card';
import CardData from '../data/card_data';
import AppDefine from '../define/app_define';

export default class Hand extends Phaser.GameObjects.Container
{
    card_data_list : CardData[];
    card_list : Card[];

    select_card : Card;

    private readonly card_scale = 1.2;

    constructor(scene : Phaser.Scene)
    {
        super(scene, 0, 0);

        const bg_width = 400;
        const bg_height = 500;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        bg_graphics.fillStyle(0x000000, 0.5);
        bg_graphics.fillRoundedRect(-bg_width * 0.5, -bg_height * 0.5, bg_width, bg_height, 10);
        this.add(bg_graphics);

        this.card_data_list = [];
        this.card_list = [];
    }

    addCard = (...card_data : CardData[]) =>
    {
        this.card_data_list.push(...card_data);

        for(let i = 0; i < card_data.length; i++)
        { 
            const card = new Card(this.scene, card_data[i]);
            card.setScale(this.card_scale, this.card_scale);
            card.on_click = this.onClickCard;

            this.add(card);
            this.card_list.push(card);
        }

        this.updateCardPos();
    }

    updateCardPos = () =>
    {
        const card_width = AppDefine.BaseCardWidth * this.card_scale;
        const card_height = AppDefine.BaseCardHeight * this.card_scale;
        const card_margin = 20;
    
        Phaser.Actions.GridAlign(this.card_list, {
			width: 2,
			height: 2,
			cellWidth: card_width + card_margin,
			cellHeight: card_height + card_margin,
            x: -(card_width + card_margin) * 0.5,
            y: -(card_height + card_margin) * 0.5
		});
    }

    onClickCard = (card : Card) =>
    {
        console.log("onClickCard");

        if(this.select_card) this.select_card.setSelect(false);
        this.select_card = card;
        this.select_card.setSelect(true);
    }
}