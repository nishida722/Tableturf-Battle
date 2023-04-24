import AppDefine from "../define/app_define";

export default class CardData
{
    id : number;
    rarity : number;
    name_jp : string;
    name_en : string;
    block_num : number;
    sp_block_num : number;
    sp_point : number;
    blocks : number[][];

    private block_height : number;
    private block_width : number;

    constructor(data : any)
    {
        this.id = data.id;
        this.rarity = data.rarity;
        this.name_jp = data.name_jp;
        this.name_en = data.name_en;
        this.block_num = data.block_num;
        this.sp_block_num = data.sp_block_num;
        this.sp_point = data.sp_point;
        this.blocks = data.blocks;

        this.block_height = this.blocks.length;

        this.block_width = 0;
        for(let row = 0; row < this.blocks.length; row++)
        {
            if(this.block_width < this.blocks[row].length)
            {
                this.block_width = this.blocks[row].length;
            }
        }
    }

    getColMax = (direction : number) : number =>
    {
        // directionに応じて回転させたblocksの列数を返す
        switch(direction)
        {
            case AppDefine.Direction.Up:
            case AppDefine.Direction.Down:
                return this.block_width;
            case AppDefine.Direction.Right:
            case AppDefine.Direction.Left:
                return this.block_height;
        }
    }

    getRowMax = (direction : number) : number =>
    {
        // directionに応じて回転させたblocksの行数を返す
        switch(direction)
        {
            case AppDefine.Direction.Up:
            case AppDefine.Direction.Down:
                return this.block_height;
            case AppDefine.Direction.Right:
            case AppDefine.Direction.Left:
                return this.block_width;
        }
    }

    // カードを回転させる
    getBlocks = (direction : number) : number[][] =>
    {
        // 値渡しになるようにコピー
        const blocks = [...this.blocks];

        // number[][]型のblocksをdirectionに応じて回転させる
        switch(direction)
        {
            case AppDefine.Direction.Up:
                return blocks;
            case AppDefine.Direction.Right:
                return this.rotateRightBlocks(blocks);
            case AppDefine.Direction.Down:
                return this.rotateRightBlocks(this.rotateRightBlocks(blocks));
            case AppDefine.Direction.Left:
                return this.rotateRightBlocks(this.rotateRightBlocks(this.rotateRightBlocks(blocks)));
        }
    }

    // number[][]型のblocksを時計回りに90度回転させる
    private rotateRightBlocks = (blocks : number[][]) : number[][] =>
    {
        const rotate_blocks : number[][] = [];

        for(let row = 0; row < blocks.length; row++)
        {
            for(let col = 0; col < blocks[row].length; col++)
            {
                if(rotate_blocks[col] === undefined)
                {
                    rotate_blocks[col] = [];
                }

                rotate_blocks[col][blocks.length - row - 1] = blocks[row][col];
            }
        }

        return rotate_blocks;
    }
}