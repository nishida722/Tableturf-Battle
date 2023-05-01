import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CardDataManager from '../data/card_data_manager';
import Card from './card';

export default class Quiz extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
    card_data_manager : CardDataManager;

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

        this.add.graphics().fillStyle(0x000000, 0.6).fillRect(0, 80, AppDefine.SIZE_WIDTH_SCREEN, 400);

        const card_data_list = this.cache.json.get('card_data');
        console.log(card_data_list);
        this.card_data_manager = new CardDataManager(card_data_list);

        const max_card_id = 55;

        let card = new Card(this,  this.card_data_manager.getCardData(Math.floor(Math.random() * max_card_id) + 1));
        card.setScale(1.5, 1.5);
        card.setSelect(true);
        this.add.existing(card);
        Phaser.Display.Align.In.Center(card, this.zone, 0, -200);
    }
}