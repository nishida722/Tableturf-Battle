import * as Phaser from 'phaser';
import AppDefine from "../define/define";
import Board from './board';
import Hand from './hand';
import CardData from '../data/card_data';
import CardDataManager from '../data/card_data_manager';

export default class InGame extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
    card_data_manager : CardDataManager;

    constructor ()
    {
        super('in_game');
    }

    preload ()
    {
        this.zone = this.add.zone(AppDefine.GameWidth * 0.5, AppDefine.GameHeight * 0.5, AppDefine.GameWidth, AppDefine.GameHeight);

        // データを読み込む
        this.load.json('card_data', './assets/data/card_data.json');
    }

    create ()
    {
        // ボードを作成
        const board = new Board(this, 20, 20, AppDefine.BoardBlockSize, true);
        this.add.existing(board);
        Phaser.Display.Align.In.Center(board, this.zone, 100, 0);

        // 手札を作成
        const hand = new Hand(this);
        this.add.existing(hand);
        Phaser.Display.Align.In.LeftCenter(hand, this.zone, -300, 0);

        const card_data_list = this.cache.json.get('card_data');
        console.log(card_data_list);
        this.card_data_manager = new CardDataManager(card_data_list);


        hand.addCard(
            this.card_data_manager.getCardData(1),
            this.card_data_manager.getCardData(2),
            this.card_data_manager.getCardData(3),
            this.card_data_manager.getCardData(4),
        );
    }
}