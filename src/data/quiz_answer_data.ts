export default class QuizAnswerData
{
    static readonly Result = {
        Incorrect : 0,
        Correct : 1,
    }

    result : number;
    remaining_time : number;

    constructor(result : number, remaining_time : number)
    {
        this.result = result;
        this.remaining_time = remaining_time;
    }
}