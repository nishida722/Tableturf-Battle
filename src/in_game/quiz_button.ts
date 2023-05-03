import * as Phaser from 'phaser';
import CardData from '../data/card_data';

export default class QuizButton extends Phaser.GameObjects.Container
{
    card_data : CardData;

    on_click : (button : QuizButton) => void;

    button_text : Phaser.GameObjects.Text;
    mask_graphics : Phaser.GameObjects.Graphics;

    width: number;
    height: number;

    constructor(scene : Phaser.Scene, width : number, height : number)
    {
        super(scene, 0, 0);

        this.width = width;
        this.height = height;

        const bg_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(bg_graphics);
        bg_graphics.fillStyle(0x0000aa, 1);
        bg_graphics.fillRoundedRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height, 10);
        bg_graphics.setInteractive(new Phaser.Geom.Rectangle(-this.width * 0.5, -this.height * 0.5, this.width, this.height), Phaser.Geom.Rectangle.Contains);
        bg_graphics.on('pointerup', () => {
           if(this.on_click) this.on_click(this);
        });

        // スプライトがクリックされたときのイベントリスナーを追加
        bg_graphics.on('pointerdown', () => {
            // クリックされたときのアニメーションを実行
            this.scene.tweens.add({
                targets: this,
                scaleX: 0.9, // スケールを0.9倍にする
                scaleY: 0.9, // スケールを0.9倍にする
                duration: 100, // 100msでアニメーションを完了させる
                ease: 'Cubic.easeOut',
                yoyo: true // アニメーションを元に戻す
            });
        });

        this.button_text = new Phaser.GameObjects.Text(this.scene, 0, 0, "", { color: '#ffffff', fontSize: '28px' ,fontFamily: 'DelaGothicOne-Regular'});
        this.button_text.setOrigin(0.5, 0.5);
        this.add(this.button_text);

        this.mask_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(this.mask_graphics);
        this.showMask(false);
    }

    setCardData(card_data : CardData)
    {
        this.card_data = card_data;
        this.button_text.setText(this.card_data.name);
    }

    showMask = (is_show : boolean) =>
    {
        this.mask_graphics.clear();
        this.mask_graphics.fillStyle(0x000000, (is_show) ? 0.5 : 0);
        this.mask_graphics.fillRoundedRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height, 10);
    }
}