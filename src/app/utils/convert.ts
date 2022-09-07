import { format } from "date-fns";
import { CascaderOption } from "../types/Cascader-option";
import { KeyValueArray } from "../types/key-value-array";
import { isNil } from "./check";

export function changeSortArray<T>(newArr: KeyValueArray<T>[], oldArr: KeyValueArray<T>[]) {
    let updateKey = '';
    const newObj: any = {};
    newArr.forEach(x => newObj[x.key] = x.value);
    const oldObj: any = {}
    oldArr.forEach(x => oldObj[x.key] = x.value);
    const checkArr = newArr.length > oldArr.length ? [...newArr] : [...oldArr];
    for (let i = 0; i < checkArr.length; i++) {
        const key = checkArr[i].key;
        if (oldObj[key] !== newObj[key]) {
            updateKey = key;
            if (isNil(oldObj[key])) {
                oldArr.push({ key, value: newObj[key] })
            } else if (isNil(newObj[key])) {
                const findIndex = oldArr.findIndex(x => x.key === key);
                oldArr.splice(findIndex, 1);
            } else {
                const findIndex = oldArr.findIndex(x => x.key === key);
                oldArr.splice(findIndex, 1);
                oldArr.push({ key, value: newObj[key] });
            }
            break;
        }
    }
    return [!!updateKey, [...oldArr]]
}

export function dateRangeToString(range: Date[]) {
    return range.map(d => format(d, 'yyyy-MM-dd HH:mm:ss')).join(' - ');
}

export function areasTocascaderOptions(areas: any[]) {
    const arr: CascaderOption[] = areas.map(x => {
        const obj: CascaderOption = {
            value: x.id,
            label: x.cityName,
        }
        const children = x.children;
        if (children && children.length > 0) {
            obj.children = areasTocascaderOptions(x.children);
        } else {
            obj.isLeaf = true;
        }
        return obj;
    })
    return arr;
}