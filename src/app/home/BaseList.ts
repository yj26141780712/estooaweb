import { FormGroup } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams, NzTableSize, NzTableSortOrder } from "ng-zorro-antd/table";
import { Subject } from "rxjs";
import { TableColumn } from "../types/table-column";
import { changeSortArray } from "../utils/convert";
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from "../utils/fullscreen";


export class BaseList {

    formGroup!: FormGroup;
    searchValue: any = {};
    total = 0;
    pageNum = 1;
    pageSize = 10;
    sortBy!: string;
    orderBy!: string;
    tableData: any[] = [];
    columns: TableColumn[] = [];
    loading = false;
    tableSize: NzTableSize = 'default';
    tablSorts: Array<{ key: string; value: NzTableSortOrder; }> = [];
    allChecked = true;
    indeterminate = false;
    destroy$ = new Subject();

    getFullscreen() {
        return isFullscreenForNoScroll();
    }

    constructor(public modalService: NzModalService) { }

    initList() { }

    setColumn(cols: TableColumn[]) {
        this.columns = [...cols];
    }

    search() {
        this.searchValue = { ...this.formGroup.value };
        this.pageNum = 1;
        this.initList();
    }

    reset() {
        this.formGroup.reset();
        this.searchValue = {};
        this.initList();
    }

    add() {
    }

    edit(e: MouseEvent, item: any) {
    }

    delete(e: MouseEvent, item: any) { }

    refresh() {
        this.initList();
    }

    setSize(size: NzTableSize) {
        this.tableSize = size;
    }

    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            this.columns = this.columns.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.columns = this.columns.map(item => ({
                ...item,
                checked: false
            }));
        }
    }

    updateSingleChecked(): void {
        if (this.columns.every(item => !item.checked)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.columns.every(item => item.checked)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
    }

    resetColumns(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.allChecked = true;
        this.indeterminate = false;
        this.updateAllChecked();
    }

    fullscreen(el: HTMLElement) {
        if (isFullscreenForNoScroll()) {
            exitFullScreen();
        } else {
            openFullscreen(el);
        }
    }

    onQueryParamsChange(params: NzTableQueryParams) {
        const { sort, pageIndex, pageSize, filter } = params;
        if (this.pageSize !== pageSize) {
            this.pageSize = pageSize;
            this.initList();
            return;
        }
        if (this.pageNum !== pageIndex) {
            this.pageNum = pageIndex;
            this.initList();
            return;
        }
        const sorts = sort.filter(item => item.value !== null);
        const [isUpdate, arr] = changeSortArray<NzTableSortOrder>(sorts, this.tablSorts);
        if (isUpdate && Array.isArray(arr)) {
            this.tablSorts = [...arr];
            arr.reverse();
            this.sortBy = arr.map(x => x.key).join(',');
            this.orderBy = arr.map(x => x.value === 'ascend' ? 'asc' : 'desc').join(',');
            this.initList();
        }
    }
}
