import * as Phaser from 'phaser';
import AppDefine from "../define/define";
import Board from './board';

export default class InGame extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;

    constructor ()
    {
        super('in_game');
    }

    preload ()
    {
        this.zone = this.add.zone(AppDefine.GameWidth * 0.5, AppDefine.GameHeight * 0.5, AppDefine.GameWidth, AppDefine.GameHeight);
    }

    create ()
    {
        const board = new Board(this);
        this.add.existing(board);
        Phaser.Display.Align.In.Center(board, this.zone);
    }
}