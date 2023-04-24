export default class AppDefine
{
    static readonly GameWidth = 1920;
    static readonly GameHeight = 1080;

    static readonly BoardBlockSize = 30;
    static readonly BoardFillColor = 0x000000;
    static readonly BoardStrokeColor = 0xffffff;

    static readonly BaseCardWidth = 130;
    static readonly BaseCardHeight = 180;
    
    // ブロックを配置する方向の定数定義
    static readonly Direction = {
        Up : 0,
        Right : 1,
        Down : 2,
        Left : 3,
    };
}