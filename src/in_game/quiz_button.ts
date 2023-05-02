import * as Phaser from 'phaser';
import CardData from '../data/card_data';

export default class QuizButton extends Phaser.GameObjects.Container
{
    card_data : CardData;

    on_click : (button : QuizButton) => void;

    button_text : Phaser.GameObjects.Text;

    constructor(scene : Phaser.Scene, width : number, height : number)
    {
        super(scene, 0, 0);

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(bg_graphics);
        bg_graphics.fillStyle(0xccccff, 1);
        bg_graphics.fillRoundedRect(-width * 0.5, -height * 0.5, width, height, 10);
        bg_graphics.setInteractive(new Phaser.Geom.Rectangle(-width * 0.5, -height * 0.5, width, height), Phaser.Geom.Rectangle.Contains);
        bg_graphics.on('pointerup', () => {
           if(this.on_click) this.on_click(this);
        });

        this.button_text = new Phaser.GameObjects.Text(this.scene, 0, 0, "", { color: '#000000', fontSize: '28px' ,fontFamily: 'DelaGothicOne-Regular'});
        this.button_text.setOrigin(0.5, 0.5);
        this.add(this.button_text);
    }

    setCardData(card_data : CardData)
    {
        this.card_data = card_data;
        this.button_text.setText(this.card_data.name);
    }
}