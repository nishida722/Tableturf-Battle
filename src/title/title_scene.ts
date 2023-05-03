import * as Phaser from 'phaser';
import AppDefine from "../define/app_define";
import CmnButton from '../common/common_button';
import CmnInfo from '../common/common_info';

export default class Title extends Phaser.Scene
{
    zone : Phaser.GameObjects.Zone;
 
    constructor ()
    {
        super({ key: AppDefine.SceneName.Title, active: false });
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

    create = () =>
    {

        this.add.shader('Some Squares', 0, 0, AppDefine.SIZE_WIDTH_SCREEN, AppDefine.SIZE_HEIGHT_SCREEN).setOrigin(0);


        const menu_container = this.add.container(0, 0);
        Phaser.Display.Align.In.Center(menu_container, this.zone, 0, 50);
        const menu_bg = new Phaser.GameObjects.Graphics(this).fillStyle(0x000000, 0.4).fillRect(-AppDefine.SIZE_WIDTH_SCREEN * 0.5, 0, AppDefine.SIZE_WIDTH_SCREEN, 350);
        menu_container.add(menu_bg);

        const menu_info = new CmnInfo(this, AppDefine.SIZE_WIDTH_SCREEN * 0.95, 50);
        menu_info.setText("クイズ選択");
        menu_container.add(menu_info);

        const button_width = AppDefine.SIZE_WIDTH_SCREEN * 0.8;
        const button_height = 50;
        const button_list : CmnButton<number>[] = [];

        const base_main_weapons_button = new CmnButton(this, button_width, button_height, 'ブキ', AppDefine.QuizMode.BaseMainWeapons);
        base_main_weapons_button.on_click = this.onSelectMenu;
        menu_container.add(base_main_weapons_button);
        button_list.push(base_main_weapons_button);

        Phaser.Actions.GridAlign(button_list, {
            width: 1,
            height: 4,
            cellWidth: button_width,
            cellHeight: button_height + 20,
            x: -button_width * 0.5,
            y: 50,
        });
    }

    onSelectMenu = (mode : number) =>
    {
        console.log(mode);
        this.input.enabled = false;
        this.cameras.main.fadeOut(AppDefine.SceneFadeSec, 0, 0, 0, (camera : Phaser.Cameras.Scene2D.Camera , progress : number) => 
        {
            if(progress >= 1)
            {
                this.scene.start(AppDefine.SceneName.Quiz, { mode: mode });
            }
        });
    }
}