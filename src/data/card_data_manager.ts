import CardData from "./card_data";
import AppUtility from "../system/app_utility";

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

    getRandom(num : number, exclude_list? : number[]) : CardData[]
    {
        const result_list : CardData[] = [];
        const card_data_list = AppUtility.shuffle(Object.keys(this.card_data_dict).map(key => this.card_data_dict[key]));

        // numの数だけランダムにカードを選ぶ(ただし除外リストに入っているものは除く)
        for(let i = 0; i < card_data_list.length; i++)
        {
            if(result_list.length >= num)
            {
                break;
            }

            if(exclude_list && exclude_list.length > 0 && exclude_list.indexOf(card_data_list[i].id) >= 0)
            {
                continue;
            }

            result_list.push(card_data_list[i]);
        }

        return result_list;
    }

    getQuiz(num : number, exclude_list? : number[]) : CardData[]
    {
        let result_list : CardData[] = [];
        const card_data_list = AppUtility.shuffle(Object.keys(this.card_data_dict).map(key => this.card_data_dict[key]));

        // まずはブロック数±1のものを選ぶ
        result_list = this.createQuiz(num, result_list, card_data_list, exclude_list, 1);

        // 次にブロック数±2のものを選ぶ
        if(result_list.length < num)
        {
            result_list = this.createQuiz(num, result_list, card_data_list, exclude_list, 2);
        }

        // それでも足りなければ無制限で選ぶ
        if(result_list.length < num)
        {
            result_list = this.createQuiz(num, result_list, card_data_list, exclude_list, -1);
        }
        
        return result_list;
    }

    private createQuiz(num , result_list : CardData[], card_data_list : CardData[], exclude_list : number[], buffer_block_num : number) : CardData[]
    {
        // 除外リストに入っているものは除く
        for(let i = 0; i < card_data_list.length; i++)
        {
            if(result_list.length >= num)
            {
                break;
            }

            if(exclude_list && exclude_list.length > 0 && exclude_list.indexOf(card_data_list[i].id) >= 0)
            {
                continue;
            }

            // すでにリストに入っているものは除く
            if(result_list.length > 0 && result_list.indexOf(card_data_list[i]) >= 0)
            {
                continue;
            }

            // 1つ目が決定している場合
            if(result_list.length > 0)
            {
                // ブロック数が±(buffer_num)以外のものを除外
                if(buffer_block_num >= 0 &&　Math.abs(result_list[0].block_num - card_data_list[i].block_num) > buffer_block_num)
                {
                    continue;
                }
            }

            result_list.push(card_data_list[i]);
        }

        return result_list;
    }
}