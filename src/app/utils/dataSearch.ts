export function searchByFileds(list: any[], fileds: string[], value: string) {
    if (value) {
        return list.filter(o => {
            return fileds.find(f => `${o[f]}`.indexOf(value) > -1);
        });
    }
    return list;
}