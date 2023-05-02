import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CardDataManager from '../data/card_data_manager';
import Card from './card';
import QuizButton from './quiz_button';
import AppUtility from '../system/app_utility';

export default class Quiz extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
    card_data_manager : CardDataManager;

    card : Card;
    button_list : QuizButton[];

    answer_list : number[];

    constructor ()
    {
        super('quiz');
    }

    preload = () =>
    {
        this.zone = this.add.zone(AppDefine.SIZE_WIDTH_SCREEN * 0.5, AppDefine.SIZE_HEIGHT_SCREEN * 0.5, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN);

        // データを読み込む
        this.load.json('card_data', './assets/data/card_data.json');

        this.load.glsl('Some Squares', './assets/shaders/some_squares.glsl.js');
    }

    create = () =>
    {
        this.add.shader('Some Squares', 0, 0, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN).setOrigin(0);

        this.add.graphics().fillStyle(0x000000, 0.4).fillRect(0, 80, AppDefine.SIZE_WIDTH_SCREEN, 400);

        const card_data_list = this.cache.json.get('card_data');
        console.log(card_data_list);
        this.card_data_manager = new CardDataManager(card_data_list);

        this.answer_list = [];
        this.nextQuiz();
    }

    nextQuiz = () =>
    {
        const card_list = this.card_data_manager.getRandom(4, this.answer_list);

        if(this.card)
        {
            this.card.destroy();
            this.card = null;
        }

        this.answer_list.push(card_list[0].id);

        this.card = new Card(this, card_list[0]);
        this.card.setScale(1.5, 1.5);
        this.card.setSelect(true);
        this.add.existing(this.card);
        Phaser.Display.Align.In.Center(this.card, this.zone, 0, -200);

        // 回答をシャッフル
        const answer_list = AppUtility.shuffle(card_list);

        //　answer_listの数だけボタンを作成してGridで配置する

        if(!this.button_list)
        {
            this.button_list = [];
            const button_width = AppDefine.SIZE_WIDTH_SCREEN * 0.8;
            const button_height = 50;

            for (let i = 0; i < answer_list.length; i++)
            {
                const button = new QuizButton(this, button_width, button_height);
                button.on_click = (button : QuizButton) => {
                    this.nextQuiz();
                }
                this.add.existing(button);
                this.button_list.push(button);
            }

            Phaser.Actions.GridAlign(this.button_list, {
                width: 1,
                height: 4,
                cellWidth: button_width,
                cellHeight: button_height + 20,
                x: AppDefine.SIZE_WIDTH_SCREEN * 0.5,
                y: 600
            });
        }

        for (let i = 0; i < answer_list.length; i++)
        {
            this.button_list[i].setCardData(answer_list[i]);
        }
    }
}