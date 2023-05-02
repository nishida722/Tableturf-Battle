import * as Phaser from 'phaser';
import CardData from '../data/card_data';

export default class QuizButton extends Phaser.GameObjects.Container
{
    card_data : CardData;

    on_click : (button : QuizButton) => void;

    mask_graphics : Phaser.GameObjects.Graphics;

    constructor(scene : Phaser.Scene, width : number, height : number ,card_data : CardData)
    {
        super(scene, 0, 0);

        this.card_data = card_data;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(bg_graphics);
        bg_graphics.fillStyle(0xccccff, 1);
        bg_graphics.fillRoundedRect(-width * 0.5, -height * 0.5, width, height, 10);
        bg_graphics.setInteractive(new Phaser.Geom.Rectangle(-width * 0.5, -height * 0.5, width, height), Phaser.Geom.Rectangle.Contains);
        bg_graphics.on('pointerdown', () => {
           if(this.on_click) this.on_click(this);
        });

        const button_text = new Phaser.GameObjects.Text(this.scene, 0, 0, card_data.name, { color: '#000000', fontSize: '28px' ,fontFamily: 'DelaGothicOne-Regular'});
        button_text.setOrigin(0.5, 0.5);
        this.add(button_text);
    }
}