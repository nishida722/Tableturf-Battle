import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import Board from './board';
import Hand from './hand';
import CardDataManager from '../data/card_data_manager';

export default class InGame extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
    card_data_manager : CardDataManager;

    board : Board;
    hand : Hand;

    constructor ()
    {
        super('in_game');
    }

    preload = () =>
    {
        this.zone = this.add.zone(AppDefine.GameWidth * 0.5, AppDefine.GameHeight * 0.5, AppDefine.GameWidth, AppDefine.GameHeight);

        // データを読み込む
        this.load.json('card_data', './assets/data/card_data.json');
    }

    create = () =>
    {
        // ボードを作成
        this.board = new Board(this, 20, 20, AppDefine.BoardBlockSize, true);
        this.add.existing(this.board);
        Phaser.Display.Align.In.Center(this.board, this.zone, 100, 0);
        this.board.on_click_board_callback = this.onClickBoard;
        this.board.on_over_board_callback = this.onOverBoard;

        // 手札を作成
        this.hand = new Hand(this);
        this.add.existing(this.hand);
        Phaser.Display.Align.In.LeftCenter(this.hand, this.zone, -300, 0);

        const card_data_list = this.cache.json.get('card_data');
        console.log(card_data_list);
        this.card_data_manager = new CardDataManager(card_data_list);

        const max_card_id = 55;

        this.hand.addCard(
            this.card_data_manager.getCardData(Math.floor(Math.random() * max_card_id) + 1),
            this.card_data_manager.getCardData(Math.floor(Math.random() * max_card_id) + 1),
            this.card_data_manager.getCardData(Math.floor(Math.random() * max_card_id) + 1),
            this.card_data_manager.getCardData(Math.floor(Math.random() * max_card_id) + 1),
        );
    }

    onClickBoard = (x : number, y : number) =>
    {
        if(this.hand.select_card)
        {
            this.board.setBoardCard(x, y, this.hand.select_card.card_data);
        }
    }

    onOverBoard = (x : number, y : number) =>
    {
        if(this.hand.select_card)
        {
            this.board.setPreviewCard(x, y, this.hand.select_card.card_data);
        }
    }
}