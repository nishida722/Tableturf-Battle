export default class ObjectPool<T>
{
    protected pool: T[] = [];

    constructor() { }

    public alloc(): T {
        return (this.pool.length > 0) ? this.pool.pop() : null;
    }

    public free(obj: T) {
        this.pool.push(obj);
    }
}