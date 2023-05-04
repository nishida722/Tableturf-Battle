import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CmnButton from '../common/common_button';
import CmnInfo from '../common/common_info';
import QuizAnswerData from '../data/quiz_answer_data';

export default class Result extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;

    scene_data : any;
    quiz_answer_data_list : QuizAnswerData[];
    correct_num_text : Phaser.GameObjects.Text;
    quiz_name_text : Phaser.GameObjects.Text;
    score_text : Phaser.GameObjects.Text;

    score : number;

    tweet_button : CmnButton<null>;
    return_title_button : CmnButton<null>;
 
    constructor ()
    {
        super({ key: AppDefine.SceneName.Result, active: false });
    }

    preload = () =>
    {
        this.zone = this.add.zone(AppDefine.SIZE_WIDTH_SCREEN * 0.5, AppDefine.SIZE_HEIGHT_SCREEN * 0.5, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN);
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
        this.quiz_answer_data_list = this.scene_data.quiz_answer_data_list;
    }

    create = () =>
    {

        this.add.shader('Some Squares', 0, 0, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN).setOrigin(0);

        const result_container = this.add.container(0, 0);
        Phaser.Display.Align.In.TopCenter(result_container, this.zone, 0, -100);
        const button_bg = new Phaser.GameObjects.Graphics(this).fillStyle(0x000000, 0.6).fillRect(-AppDefine.SIZE_WIDTH_SCREEN * 0.5, 0, AppDefine.SIZE_WIDTH_SCREEN, 350);
        result_container.add(button_bg);

        const result_info = new CmnInfo(this, AppDefine.SIZE_WIDTH_SCREEN * 0.95, 50);
        result_info.setText("結果発表");
        result_container.add(result_info);

        // quizシーンからシーン切り替え時に渡されたデータを受け取る

        const correct_num = (this.quiz_answer_data_list) ? this.quiz_answer_data_list.filter((data) => data.result == QuizAnswerData.Result.Correct).length : 0;
        const total_num = (this.quiz_answer_data_list) ? this.quiz_answer_data_list.length : 0;

        // スコア計算(全問正解で3000になるようにする)
        const base_score = Math.floor(3000 / total_num);
        this.score = 0;
        for(let i = 0; i < this.quiz_answer_data_list.length; i++)
        {
            if(this.quiz_answer_data_list[i].result == QuizAnswerData.Result.Correct)
            {
                const time_rate = (this.quiz_answer_data_list[i].remaining_time / AppDefine.QuizTimeLimitSec) + 0.334;
                this.score += base_score * time_rate;
            }
        }

        // 正解率による補正
        this.score = Math.floor(this.score);
        
        this.correct_num_text = new Phaser.GameObjects.Text(this, 0, 0, `正解数 : ${correct_num} / ${total_num}`, {fontFamily: AppDefine.DefaultFontFamily, fontSize: 30, color: "#ffffff"}).setOrigin(0, 0.5);
        this.correct_num_text.x = -AppDefine.SIZE_WIDTH_SCREEN * 0.5 + 20;
        this.correct_num_text.y = 50;
        result_container.add(this.correct_num_text);

        this.quiz_name_text = new Phaser.GameObjects.Text(this, 0, 0, this.scene_data.name, {fontFamily: AppDefine.DefaultFontFamily, fontSize: 30, color: "#ffffff"}).setOrigin(0.5, 0.5);
        this.quiz_name_text.x = 0;
        this.quiz_name_text.y = 120;
        result_container.add(this.quiz_name_text);

        this.score_text = new Phaser.GameObjects.Text(this, 0, 0, `XP 0000`, {fontFamily: AppDefine.DefaultFontFamily, fontSize: 90, color: "#ffffff"}).setOrigin(0.5, 0.5);
        this.score_text.x = 0;
        this.score_text.y = 200;
        result_container.add(this.score_text);

        const menu_container = this.add.container(0, 0);
        Phaser.Display.Align.In.BottomCenter(menu_container, this.zone, 0, -150);


        const button_width = AppDefine.SIZE_WIDTH_SCREEN * 0.8;
        const button_height = 50;

        this.tweet_button = new CmnButton(this, button_width, button_height, '結果をツイートする');
        this.tweet_button.on_click = () => {
            const tweet_text = `【#ナワバトクイズ : ${this.scene_data.name}】\nXP ${this.score} 達成！(正解数 : ${correct_num} / ${total_num})\n\nhttps://nb-quiz.bysjm.com/`;
            const tweet_url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet_text);
            window.open(tweet_url, "_blank");
        };
        this.add.existing(this.tweet_button);
        Phaser.Display.Align.In.Center(this.tweet_button, this.zone, 0, 0);

        this.return_title_button = new CmnButton(this, button_width, button_height, 'タイトルへ');
        this.return_title_button.on_click = () => {
            this.input.enabled = false;
            this.cameras.main.fadeOut(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) => 
            {
                if(progress >= 1)
                {
                    this.scene.start(AppDefine.SceneName.Title);
                }
            });
        };
        menu_container.add(this.return_title_button);

        Phaser.Actions.GridAlign([this.return_title_button], {
            width: 1,
            height: 4,
            cellWidth: button_width,
            cellHeight: button_height + 20,
            x: -button_width * 0.5,
            y: 50,
        });

        this.playResultEffect();
    }

    playResultEffect = async () : Promise<void> =>
    {
        this.input.enabled = false;

        this.correct_num_text.scaleY = 0;
        this.quiz_name_text.scaleY = 0;
        this.score_text.scaleY = 0;
        this.tweet_button.scaleY = 0;

        this.return_title_button.alpha = 0;

        // 反転されるようなアニメーション
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: this.correct_num_text,
                scaleY: 1,
                duration: 100, // 100msでアニメーションを完了させる
                delay: 2000, // 2秒後にアニメーションを開始する
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    resolve();
                }
            });
        });

        // 反転されるようなアニメーション
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: this.quiz_name_text,
                scaleY: 1,
                duration: 100, // 100msでアニメーションを完了させる
                delay: 500, // 500ms後にアニメーションを開始する
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    resolve();
                }
            });
        });

        // 反転されるようなアニメーション
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: this.score_text,
                scaleY: 1,
                duration: 100, // 100msでアニメーションを完了させる
                delay: 500, // 500ms後にアニメーションを開始する
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    resolve();
                }
            });
        });

        // 現在の値を格納するオブジェクト
        let currentValue = { value: 0 };

        // tweenをシーンに追加
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: currentValue,
                value: this.score,
                duration: 1000,
                delay: 500, // 500ms後にアニメーションを開始する
                onUpdate: () => {
                    // 現在の値を小数点以下切り捨てして表示
                    this.score_text.text = `XP ${Math.floor(currentValue.value).toString().padStart(4, '0')}`;
                },
                onComplete: () => {
                    resolve();
                }
            });
        });

        // 反転されるようなアニメーション
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: this.tweet_button,
                scaleY: 1,
                duration: 100, // 100msでアニメーションを完了させる
                delay: 500, // 500ms後にアニメーションを開始する
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    resolve();
                }
            });
        });

        // アルファフェードでボタンを表示
        await new Promise<void>(resolve => {
            this.tweens.add({
                targets: this.return_title_button,
                alpha: 1,
                duration: 1000, // 500msでアニメーションを完了させる
                delay: 500, // 500ms後にアニメーションを開始する
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    resolve();
                }
            });
        });

        this.input.enabled = true;
    }
}