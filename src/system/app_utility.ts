export default class AppUtility
{
    // 配列をシャッフルして返す(ディープコピー)
    static shuffle(array)
    {
        const tmp_array = array.slice();

        for (let i = tmp_array.length - 1; i > 0; i--)
        {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = tmp_array[i];
            tmp_array[i] = tmp_array[r];
            tmp_array[r] = tmp;
        }
        return tmp_array;
    }
}