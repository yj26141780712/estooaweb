export function fuzzySearch(arr: any[], keyword: string) {
    return arr.filter(a => {
        const keys = Object.keys(a);
        for (let i = 0; i < keys.length; i++) {
            if (a[keys[i]] && String(a[keys[i]]).indexOf(keyword) > -1) {
                return true;
            }
        }
        return false;
    });
}