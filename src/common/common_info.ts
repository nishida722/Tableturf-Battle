import * as Phaser from 'phaser';
import AppDefine from '../define/app_define';

export default class CmnInfo extends Phaser.GameObjects.Container
{
    text : Phaser.GameObjects.Text;

    constructor(scene : Phaser.Scene, width : number, height : number)
    {
        super(scene, 0, 0);

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(bg_graphics);
        bg_graphics.fillStyle(0x000000, 1);
        bg_graphics.fillRoundedRect(-width * 0.5, -height * 0.5, width, height, 10);

        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, "", { color: '#ffffff', fontSize: '28px' ,fontFamily: AppDefine.DefaultFontFamily});
        this.text.setOrigin(0.5, 0.5);
        this.add(this.text);
    }

    setText = (text : string) =>
    {
        this.text.setText(text);
    }
}