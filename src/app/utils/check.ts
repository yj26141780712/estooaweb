import { KeyValueArray } from '../types/key-value-array';

export function isNil(value: unknown) {
    return value === undefined || value === null;
}

export function isArrayEqual<T>(a: KeyValueArray<T>[], b: KeyValueArray<T>[]) {
    if (a.length !== b.length) {
        return false;
    }
    a.sort((a, b) => a > b ? 1 : -1);
    b.sort((a, b) => a > b ? 1 : -1);
    for (let i = 0; i < a.length; i++) {
        if (a[i].value !== b[i].value) {
            return false;
        }
    }
    return true;
}