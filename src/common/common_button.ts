import * as Phaser from 'phaser';
import AppDefine from '../define/app_define';

export default class CmnButton<T> extends Phaser.GameObjects.Container
{
    callback_data : T;

    on_click : (data : T) => void;

    button_text : Phaser.GameObjects.Text;
    mask_graphics : Phaser.GameObjects.Graphics;

    width: number;
    height: number;

    constructor(scene : Phaser.Scene, width : number, height : number, button_text : string, callback_data? : T)
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
           if(this.on_click) this.on_click(this.callback_data);
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

        this.button_text = new Phaser.GameObjects.Text(this.scene, 0, 0, "", { color: '#ffffff', fontSize: '28px' ,fontFamily: AppDefine.DefaultFontFamily});
        this.button_text.setOrigin(0.5, 0.5);
        this.add(this.button_text);

        this.mask_graphics = new Phaser.GameObjects.Graphics(this.scene);
        this.add(this.mask_graphics);
        this.showMask(false);

        this.setText(button_text);
        this.setCallbackData(callback_data);
    }

    setCallbackData(data : T)
    {
        this.callback_data = data;
    }

    setText(text : string, text_style? : Phaser.Types.GameObjects.Text.TextStyle)
    {
        this.button_text.setText(text);
        if(text_style) this.button_text.setStyle(text_style);
    }

    showMask = (is_show : boolean) =>
    {
        this.mask_graphics.clear();
        this.mask_graphics.fillStyle(0x000000, (is_show) ? 0.5 : 0);
        this.mask_graphics.fillRoundedRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height, 10);
    }
}