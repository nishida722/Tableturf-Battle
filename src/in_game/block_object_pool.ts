import ObjectPool from "../system/object_pool";
import Block from "./block";

export default class BlockObjectPool<T extends Block> extends ObjectPool<T>
{
    override alloc(): T {
       const obj = super.alloc();
       if(obj)obj.setVisible(true);
       return obj;
    }

    override free(obj: T) {
        if(obj)
        {
            obj.setVisible(false);
            super.free(obj);
        }
    }
}