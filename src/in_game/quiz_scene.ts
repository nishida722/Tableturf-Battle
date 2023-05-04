import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CardDataManager from '../data/card_data_manager';
import Card from './card';
import CmnButton from '../common/common_button';
import AppUtility from '../system/app_utility';
import CmnInfo from '../common/common_info';
import CardData from '../data/card_data';
import QuizAnswerData from '../data/quiz_answer_data';

export default class Quiz extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
    card_data_manager : CardDataManager;

    card : Card;
    button_list : CmnButton<CardData>[];

    answer_num : number;

    // 除外IDリスト
    exclude_list : number[];

    quiz_count : number;
    quiz_count_max : number;
    quiz_count_info : CmnInfo;

    quiz_message_info : CmnInfo;

    quiz_answer_data_list : QuizAnswerData[];

    quiz_time_limit_sec : number;
    quiz_time_limit_sec_text : Phaser.GameObjects.Text;
    quiz_time_limit_milli_sec_text : Phaser.GameObjects.Text;
    quiz_timer_tween : Phaser.Tweens.Tween;
    
    ui_list : Phaser.GameObjects.GameObject[];

    scene_data : any;

    constructor ()
    {
        super({ key: AppDefine.SceneName.Quiz, active: false });
    }

    preload = () =>
    {
        this.zone = this.add.zone(AppDefine.SIZE_WIDTH_SCREEN * 0.5, AppDefine.SIZE_HEIGHT_SCREEN * 0.5, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN);

        // データを読み込む
        this.load.json('card_data', './assets/data/card_data.json');

        this.load.glsl('Some Squares', './assets/shaders/some_squares.glsl.js');

        this.cameras.main.fadeIn(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) =>
        {
            if(progress >= 1)
            {
                this.input.enabled = true;
            }
        });
    }

    init(data) {
        this.scene_data = data;
    }

    create = () =>
    {

        gtag('event', 'game_play', {
            'event_category': 'game',
            'event_label': 'game_play'
        });

        this.add.shader('Some Squares', 0, 0, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN).setOrigin(0);

        this.startEffect();
    }

    startEffect = async () : Promise<void> =>
    {
        // 操作無効
        this.input.enabled = false;

        const count_text = this.add.text(0, 0, "Ready?", { fontFamily: AppDefine.DefaultFontFamily, fontSize: 100, color: "#0000aa" }).setOrigin(0.5);
        this.add.existing(count_text);
        Phaser.Display.Align.In.Center(count_text, this.zone);

        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: count_text,
                scale: 0.75,
                duration: 1500,
                delay: 1000,
                ease: 'Power2',
                onComplete: () =>
                {
                    resolve();
                }
            });
        });

        count_text.setText("Go!");
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: count_text,
                scale: 10.0,
                alpha: 0.0,
                duration: 500,
                ease: 'Quadratic',
                onComplete: () =>
                {
                    resolve();
                }
            });
        });

        count_text.destroy();
    
        this.setupQuiz();

        // 操作有効
        this.input.enabled = true;
    }

    setupQuiz = () =>
    {
        const card_data_list = this.cache.json.get('card_data');
        this.card_data_manager = new CardDataManager(card_data_list);

        this.ui_list = [];

        this.ui_list.push(this.add.graphics().fillStyle(0x000000, 0.4).fillRect(0, 80, AppDefine.SIZE_WIDTH_SCREEN, 350));

        this.quiz_count = 0;
        this.quiz_count_max = 15;
        this.answer_num = 5;
        this.exclude_list = [];

        this.quiz_answer_data_list = [];

        this.quiz_count_info = new CmnInfo(this, 150, 50);
        Phaser.Display.Align.In.Center(this.quiz_count_info, this.zone, 0, -400);
        this.add.existing(this.quiz_count_info);
        this.ui_list.push(this.quiz_count_info);

        const button_container = this.add.container(0, 0);
        this.ui_list.push(button_container);

        Phaser.Display.Align.In.Center(button_container, this.zone, 0, 50);
        const button_bg = new Phaser.GameObjects.Graphics(this).fillStyle(0x000000, 0.4).fillRect(-AppDefine.SIZE_WIDTH_SCREEN * 0.5, 0, AppDefine.SIZE_WIDTH_SCREEN, 400);
        button_container.add(button_bg);

        this.quiz_message_info = new CmnInfo(this, AppDefine.SIZE_WIDTH_SCREEN * 0.95, 50);
        this.quiz_message_info.setText("このカードはどれ？");
        button_container.add(this.quiz_message_info);

        this.button_list = [];
        const button_width = AppDefine.SIZE_WIDTH_SCREEN * 0.8;
        const button_height = 50;

        for (let i = 0; i < this.answer_num; i++)
        {
            const button = new CmnButton<CardData>(this, button_width, button_height, "", null);
            button.on_click = this.onSelectAnswer;
            button_container.add(button);
            this.button_list.push(button);
        }

        Phaser.Actions.GridAlign(this.button_list, {
            width: 1,
            height: this.button_list.length,
            cellWidth: button_width,
            cellHeight: button_height + 20,
            x: -button_width * 0.5,
            y: 50,
        });

        const time_container = this.add.container(0, 0);
        Phaser.Display.Align.In.LeftCenter(time_container, this.zone, 0, 35);
        this.add.existing(time_container);
        this.ui_list.push(time_container);

        // 円形を描画
        const circle = this.add.graphics().fillStyle(0x000000, 1).fillCircle(50, -15, 35);
        time_container.add(circle);

        // 円形を描画
        const sub_circle = this.add.graphics().fillStyle(0x000000, 1).fillCircle(90, 0, 20);
        time_container.add(sub_circle);

        // 円形を描画
        const mini_circle = this.add.graphics().fillStyle(0x000000, 1).fillCircle(90, -30, 5);
        time_container.add(mini_circle);

        this.quiz_time_limit_sec_text = new Phaser.GameObjects.Text(this, 50, -15, "10.", { color: '#ffffff', fontSize: '28px' ,fontFamily: AppDefine.DefaultFontFamily});
        this.quiz_time_limit_sec_text.setOrigin(0.5, 0.5);
        time_container.add(this.quiz_time_limit_sec_text);

        this.quiz_time_limit_milli_sec_text = new Phaser.GameObjects.Text(this, 85, -5, "00", { color: '#ffffff', fontSize: '12px' ,fontFamily: AppDefine.DefaultFontFamily});
        this.quiz_time_limit_milli_sec_text.setOrigin(0.5, 0.5);
        time_container.add(this.quiz_time_limit_milli_sec_text);

        this.nextQuiz();
    }

    nextQuiz = () =>
    {
        this.quiz_count++;

        // 最終問題まで終わったら結果画面へ
        if(this.quiz_count > this.quiz_count_max)
        {
            this.input.enabled = false;

            this.ui_list.forEach((ui) => 
            {
                ui.destroy();
            });
            if(this.card) this.card.destroy();

            const count_text = this.add.text(0, 0, "Finish!", { fontFamily: AppDefine.DefaultFontFamily, fontSize: 100, color: "#0000aa" }).setOrigin(0.5);
            this.add.existing(count_text);
            Phaser.Display.Align.In.Center(count_text, this.zone);
    
            this.tweens.add({
                targets: count_text,
                scale: 0.75,
                duration: 1500,
                ease: 'Power2',
                onComplete: () =>
                {
                    this.cameras.main.fadeOut(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) =>
                    {
                        if(progress >= 1)
                        {
                            this.scene_data.quiz_answer_data_list = this.quiz_answer_data_list;

                            this.scene.start(AppDefine.SceneName.Result, this.scene_data);
                        }
                    });
                }
            });

            return;
        }
        
        const quiz_count_info_scale = 1.0;
        this.quiz_count_info.setText(`Q ${this.quiz_count}/${this.quiz_count_max}`);
        this.quiz_count_info.setScale(quiz_count_info_scale, 0);
        // 反転されるようなアニメーション
        this.tweens.add({
            targets: this.quiz_count_info,
            scaleX: quiz_count_info_scale,
            scaleY: quiz_count_info_scale,
            duration: 100, // 100msでアニメーションを完了させる
            ease: 'Cubic.easeOut',
        });

        const card_list = this.card_data_manager.getQuiz(this.answer_num, this.exclude_list);

        if(this.card)
        {
            this.card.destroy();
            this.card = null;
        }

        // 出題されたカードは除外リストに追加
        this.exclude_list.push(card_list[0].id);

        const card_scale = 1.5;
        this.card = new Card(this, card_list[0]);
        this.card.setScale(0, card_scale);
        this.card.setSelect(true);
        this.add.existing(this.card);
        Phaser.Display.Align.In.Center(this.card, this.zone, 0, -200);

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

        // 回答をシャッフル
        const answer_list = AppUtility.shuffle(card_list);

        //　answer_listの数だけボタンを作成してGridで配置する
        for (let i = 0; i < this.answer_num; i++)
        {
            this.button_list[i].setText(answer_list[i].name);
            this.button_list[i].setCallbackData(answer_list[i]);
            this.button_list[i].showMask(false);
            this.button_list[i].setScale(1, 0);

            // 反転されるようなアニメーション
            this.tweens.add({
                targets: this.button_list[i],
                scaleX: 1,
                scaleY: 1,
                duration: 100, // 100msでアニメーションを完了させる
                ease: 'Cubic.easeOut',
            });
        }

        // カウントダウン
        // 現在の値を格納するオブジェクト
        let current_sec_value = { value: AppDefine.QuizTimeLimitSec };

        // tweenをシーンに追加

        this.quiz_timer_tween = this.tweens.add({
            targets: current_sec_value,
            value: 0,
            duration: AppDefine.QuizTimeLimitSec,
            onUpdate: () => {
                this.quiz_time_limit_sec = Math.floor(current_sec_value.value);

                // 5桁になるように0埋め
                const limit_sec = this.quiz_time_limit_sec.toString().padStart(5, '0')
                
                //　limit_secの先頭2桁を秒として表示
                this.quiz_time_limit_sec_text.text = `${limit_sec.slice(0, 2)}.`;

                // limit_secの下2桁をミリ秒として表示
                this.quiz_time_limit_milli_sec_text.text = limit_sec.slice(2,4);
            },
            onComplete: () => {
                // タイムアウトの場合自動で不正解とする
                this.onSelectAnswer(null);
            }
        });

    }

    onSelectAnswer = (card_data : CardData) =>
    {
        // 操作を無効にする
        this.input.enabled = false;

        this.quiz_timer_tween.stop();
        console.log(this.quiz_time_limit_sec);

        // 除外リストの最後の要素が正解のカードID
        const answer_card_id = this.exclude_list[this.exclude_list.length - 1];

        const result = (card_data && answer_card_id == card_data.id) ? QuizAnswerData.Result.Correct : QuizAnswerData.Result.Incorrect;
        console.log((result == QuizAnswerData.Result.Correct) ? "正解" : "不正解");
        this.quiz_answer_data_list.push(new QuizAnswerData(result, this.quiz_time_limit_sec));

        for (let i = 0; i < this.answer_num; i++)
        {
            this.button_list[i].showMask(this.button_list[i].callback_data.id != answer_card_id);
        }

        this.time.delayedCall(1000, () =>
        {
            this.nextQuiz();

            // 操作ロックを解除する
            this.input.enabled = true;
        }, [], this);
    }
}