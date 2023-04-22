export default class CardData
{
    id : number;
    name : string;
    blocks : number[][];

    constructor(data : any)
    {
        this.id = data.id;
        this.name = data.name;
        this.blocks = data.blocks;
    }
}