import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CmnButton from '../common/common_button';
import CmnInfo from '../common/common_info';
import Card from '../in_game/card';
import CardDataManager from '../data/card_data_manager';

export default class Title extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;

    card_data_manager : CardDataManager;
    card : Card;
 
    constructor ()
    {
        super({ key: AppDefine.SceneName.Title, active: false });
    }

    preload = () =>
    {
        this.zone = this.add.zone(AppDefine.SIZE_WIDTH_SCREEN * 0.5, AppDefine.SIZE_HEIGHT_SCREEN * 0.5, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN);
        this.load.glsl('Some Squares', './assets/shaders/some_squares.glsl.js');

        // データを読み込む
        this.load.json('card_data', './assets/data/card_data.json');

        this.cameras.main.fadeIn(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) =>
        {
            if(progress >= 1)
            {
                this.input.enabled = true;
            }
        });
    }

    create = () =>
    {

        this.add.shader('Some Squares', 0, 0, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN).setOrigin(0);

        const card_data_list = this.cache.json.get('card_data');
        this.card_data_manager = new CardDataManager(card_data_list);

        this.setupCard();

        // ルール

        const info_width = AppDefine.SIZE_WIDTH_SCREEN * 0.95;

        const rule_container = this.add.container(0, 0);
        Phaser.Display.Align.In.Center(rule_container, this.zone, 0, -50);
        const rule_bg = new Phaser.GameObjects.Graphics(this).fillStyle(0xffffff, 0.95).fillRect(-info_width * 0.5, 0, info_width, 250);
        rule_container.add(rule_bg);

        const rule_info = new CmnInfo(this, info_width, 50);
        rule_info.setText("ルール説明");
        rule_container.add(rule_info);

        const rule_text = new Phaser.GameObjects.Text(this, 0, 100, 
`
・表示されたナワバトラーカードを当てるクイズです
・5つの選択肢から選んで回答します
・15問の問題が出題されます
・1問につき10秒間の制限時間があります
・回答は早いほど正解した時のスコアが高くなります
`
        , { color: '#000000', fontSize: '20px' ,fontFamily: AppDefine.DefaultFontFamily}).setOrigin(0.5, 0.5);
        rule_container.add(rule_text);

        // 免責事項を表すテキスト
        const rule2_text = new Phaser.GameObjects.Text(this, 0, 230, 
`
※当ゲームは非公式のものであり、任天堂株式会社とは一切関係ありません
　管理者Twitter：@sjm_spla
`
        , { color: '#888888', fontSize: '12px' ,fontFamily: AppDefine.DefaultFontFamily}).setOrigin(0.5, 0.5);
        rule_container.add(rule2_text);

        // メニュー

        const menu_container = this.add.container(0, 0);
        Phaser.Display.Align.In.Center(menu_container, this.zone, 0, 250);
        const menu_bg = new Phaser.GameObjects.Graphics(this).fillStyle(0xffffff, 0.95).fillRect(-info_width * 0.5, 0, info_width, 250);
        menu_container.add(menu_bg);

        const menu_info = new CmnInfo(this, info_width, 50);
        menu_info.setText("クイズ選択");
        menu_container.add(menu_info);

        const button_width = AppDefine.SIZE_WIDTH_SCREEN * 0.8;
        const button_height = 50;
        const button_list : CmnButton<any>[] = [];

        const base_main_weapons_button = new CmnButton(this, button_width, button_height, 'ブキ編', { mode : AppDefine.QuizMode.BaseMainWeapons, name : "ブキ編" });
        base_main_weapons_button.on_click = this.onSelectMenu;
        menu_container.add(base_main_weapons_button);
        button_list.push(base_main_weapons_button);

        const comming_soon_button = new CmnButton(this, button_width, button_height, 'COMING SOON', { mode : AppDefine.QuizMode.BaseMainWeapons, name : "COMING SOON" });
        comming_soon_button.on_click = this.onSelectMenu;
        comming_soon_button.showMask(true);
        comming_soon_button.setAlpha(0.3);
        menu_container.add(comming_soon_button);
        button_list.push(comming_soon_button);

        Phaser.Actions.GridAlign(button_list, {
            width: 1,
            height: 4,
            cellWidth: button_width,
            cellHeight: button_height + 20,
            x: -button_width * 0.5,
            y: 50,
        });
    }

    onSelectMenu = (button_data : any) =>
    {
        console.log(button_data);
        this.input.enabled = false;
        this.cameras.main.fadeOut(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) => 
        {
            if(progress >= 1)
            {
                this.scene.start(AppDefine.SceneName.Quiz, button_data);
            }
        });
    }

    private setupCard = () =>
    {
        if(this.card)
        {
            this.card.destroy();
            this.card = null;
        }

        const card_scale = 1.5;
        this.card = new Card(this, this.card_data_manager.getRandom(1)[0]);
        this.card.setScale(0, card_scale);
        this.card.setSelect(true);
        this.add.existing(this.card);
        Phaser.Display.Align.In.Center(this.card, this.zone, 0, -250);

        // カードを反転されるようなアニメーション
        this.tweens.add({
            targets: this.card,
            scaleX: card_scale,
            scaleY: card_scale,
            duration: 100, // 100msでアニメーションを完了させる
            ease: 'Cubic.easeOut',
        });

        // ふわふわと動くアニメーションを適用
        this.tweens.add({
            targets: this.card,
            y: this.card.y - 10,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true, // 往復アニメーションを有効にする
            repeat: -1 // 無限にリピートする
        });

        // 3秒後にthis.setupCardを呼び出して別のカードに切り替える
        this.time.addEvent({
            delay: 3000,
            callback: this.setupCard,
            callbackScope: this,
        });
    }
}