import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { TreeData, TreeNode, TreeViewComponent } from '../../tree-view/tree-view.component';
import { AreaSelectService } from '../area-select.service';

@Component({
  selector: 'app-area-select',
  templateUrl: './area-select.component.html',
  styleUrls: ['./area-select.component.scss']
})
export class AreaSelectComponent implements OnInit, OnDestroy {

  treeData: TreeData[] = [];
  selectedKeys: [] = [];
  callback = (arr: any[]) => { };
  allChecked = false;
  @ViewChild('tree') tree!: TreeViewComponent;
  destroy$ = new Subject<void>();
  constructor(private modalRef: NzModalRef,
    private areaSelectService: AreaSelectService) { }

  ngOnInit(): void {
    this.areaSelectService.getChinaCitySelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        if (json.code === 200) {
          this.treeData = json.data.map((x: any) => {
            return {
              name: x.cityName, id: x.id, parentId: x.parentId,
              origin: x
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nodeClickEvent(node: TreeNode) {
    console.log(node);
  }

  confirm(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const nodes = this.tree.getOnlyCheckedParentKeys();
    this.callback(nodes);
    this.modalRef.destroy();
  }

  updateAllChecked() {
    this.tree.selectAllNodes(this.allChecked);
  }
}
