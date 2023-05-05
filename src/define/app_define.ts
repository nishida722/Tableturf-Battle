export default class AppDefine
{
    static readonly  SIZE_WIDTH_SCREEN = 540
    static readonly  SIZE_HEIGHT_SCREEN = 960

    static readonly BoardBlockSize = 30;
    static readonly BoardFillColor = 0x000000;
    static readonly BoardStrokeColor = 0xffffff;

    static readonly BaseCardWidth = 130;
    static readonly BaseCardHeight = 180;

    static readonly SceneFadeSec = 1000 * 0.5; // フェードイン/アウトで半分ずつ

    static readonly QuizTimeLimitSec = 1000 * 10; // 10秒

    static readonly DefaultFontFamily = "CustomFont_01";
    
    // ブロックを配置する方向の定数定義
    static readonly Direction = {
        Up : 0,
        Right : 1,
        Down : 2,
        Left : 3,
    };

    // クイズモードの定数定義
    static readonly QuizMode = {
        BaseMainWeapons : 1,
    }

    // シーン名の定数定義
    static readonly SceneName = {
        Title : "Title",
        Quiz : "Quiz",
        Result : "Result",
    }

    // カードカテゴリ(ビット演算)
    static readonly CardCategory = {
        MainWeapon : 1 << 0,
        SubWeapon : 1 << 1,
        SpecialWeapon : 1 << 2,
        Character : 1 << 3,
        Brand : 1 << 4,
        HeroMode : 1 << 5,
        SalmonRun : 1 << 6,
        GachiRule : 1 << 7,

        // すべてに一致する
        All : 0xffffffff,
    }


}