import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { TableColumn } from 'src/app/types/table-column';
import { SearchFormComponent } from './search-form/search-form.component';

export interface SearchItem {
  key: string;
  label: string
}

export interface SearchOption {
  callback: (data: any) => void;
  dataLoading: (data: any) => Observable<any[]>;
  title?: string;
  multiple?: boolean;
  searchItems?: SearchItem[];
  tableItems?: TableColumn[];
  checkIds?: number[];
}

@Injectable()
export class SearchModalService {

  constructor(private modalService: NzModalService) { }

  openSelect(options: SearchOption) {
    this.modalService.create({
      nzTitle: options.title || '选择项目',
      nzContent: SearchFormComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'padding': '0'
      },
      nzComponentParams: {
        multiple: options?.multiple,
        callback: options.callback,
        dataLoading: options.dataLoading,
        searchItems: options.searchItems || [],
        columns: options.tableItems || [],
        checkIds: options.checkIds || []
      }
    });
  }
}
