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

    get col_max() : number
    {
        return this.block_width;
    }

    get row_max() : number
    {
        return this.block_height;
    }
}