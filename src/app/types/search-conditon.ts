export interface SearchCondition {
    pageSize?: number;
    pageNum?: number;
    sortBy?: string;
    orderBy?: string;
    [key: string]: any;
}