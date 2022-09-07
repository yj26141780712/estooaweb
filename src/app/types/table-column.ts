import { NzTableFilterFn } from "ng-zorro-antd/table";

export interface TableColumn {
    key: string,
    title: string,
    checked: boolean,
    change?: (value: any, key?: string, item?: any) => any,
    showFilter?: boolean,
    filters?: Array<{ text: string; value: any; byDefault?: boolean }>,
    filterFn?: NzTableFilterFn<any> | boolean,
    filterMultiple?: boolean,
    showSort?: boolean,
    sortFn?: NzTableFilterFn<any> | boolean,
    width?: string;
    [key: string]: any
}