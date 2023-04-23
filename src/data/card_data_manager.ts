import CardData from "./card_data";

export default class CardDataManager
{
   card_data_dict : {[key : number] : CardData};

    constructor(card_data_list : any[])
    {
        this.card_data_dict = {};

        for(let i = 0; i < card_data_list.length; i++)
        {
            const card_data = new CardData(card_data_list[i]);
            this.card_data_dict[card_data.id] = card_data;
        }
    }

    getCardData(id : number) : CardData
    {
        return this.card_data_dict[id];
    }
}