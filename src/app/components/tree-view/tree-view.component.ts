import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { TreeViewService } from './tree-view.service';

export interface TreeNode {
  name: string;
  key: number;
  disabled?: boolean;
  children?: TreeNode[];
  origin: any;
}

export interface TreeData {
  name: string;
  id: number;
  parentId: number;
  [key: string]: any;
}

/** Flat node with expandable and level information */
interface ExampleTreeNode {
  expandable: boolean;
  name: string;
  key: number;
  level: number;
  disabled: boolean;
  children: TreeNode[];
  isLeaf: boolean;
  origin: any;
}

class FilteredTreeResult {
  constructor(public treeData: TreeNode[], public needsToExpanded: TreeNode[] = []) {
  }
}

function filterTreeData(data: TreeNode[], value: string): FilteredTreeResult {
  const needsToExpanded = new Set<TreeNode>();
  const _filter = (node: TreeNode, result: TreeNode[]) => {
    if (node.name.search(value) !== -1) {
      result.push(node);
      return result;
    }
    if (Array.isArray(node.children)) {
      const nodes = node.children.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
      if (nodes.length) {
        const parentNode = { ...node, children: nodes };
        needsToExpanded.add(parentNode);
        result.push(parentNode);
      }
    }
    return result;
  };
  const treeData = data.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
  return new FilteredTreeResult(treeData, [...needsToExpanded]);
}



@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.less']
})
export class TreeViewComponent implements OnInit, AfterViewInit, OnChanges {

  searchValue = '';
  searchValue$ = new BehaviorSubject<string>('');
  exampleNodeMap = new Map<ExampleTreeNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, ExampleTreeNode>();
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const exampleNode =
      existingNode && existingNode.key === node.key
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          key: node.key,
          level,
          disabled: node.disabled,
          children: node.children,
          isLeaf: !(node.children && node.children.length > 0),
          origin: node.origin
        } as ExampleTreeNode;
    if (this.showCheckbox && exampleNode.isLeaf && this.checkedKeys.includes(exampleNode.key)) {
      this.checklistSelection.select(exampleNode);
    }
    if (this.selectedKeys && exampleNode.isLeaf && this.selectedKeys.includes(exampleNode.key)) {
      this.selectListSelection.select(exampleNode);
    }
    this.exampleNodeMap.set(exampleNode, node);
    this.nestedNodeMap.set(node, exampleNode);
    return exampleNode;
  }
  checklistSelection = new SelectionModel<ExampleTreeNode>(true);
  selectListSelection = new SelectionModel<ExampleTreeNode>(true);
  treeControl = new FlatTreeControl<ExampleTreeNode, TreeNode>(
    node => node.level,
    node => node.expandable,
    {
      // tslint:disable-next-line: no-non-null-assertion
      trackBy: exampleNode => this.exampleNodeMap.get(exampleNode)!
    }
  );
  treeFlattener = new NzTreeFlattener<TreeNode, ExampleTreeNode, TreeNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleTreeNode) => node.expandable;
  expandedNodes: TreeNode[] = [];

  originData$ = new BehaviorSubject<TreeNode[]>([]);
  filteredData$ = combineLatest([
    this.originData$,
    this.searchValue$.pipe(
      auditTime(300),
      map(value => (this.searchValue = value)))
  ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));

  getNode(name: string): ExampleTreeNode | null {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }

  descendantsAllSelected(node: ExampleTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: ExampleTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  @Input() treeData!: TreeData[];
  @Input() placeholder = 'Search';
  @Input() showSearch = false;
  @Input() showCheckbox = false;
  @Input() icon = 'home';
  @Input() checkedKeys: any[] = [];
  @Input() expandedKeys: any[] = [];
  @Input() selectedKeys: any[] = [];
  @Input() treeTemplate: TemplateRef<{ $implicit: TreeNode; }> | null = null;
  @Output() searchValueEvent: EventEmitter<any> = new EventEmitter();
  @Output() nodeClickEvent: EventEmitter<any> = new EventEmitter();
  constructor(private treeViewService: TreeViewService) {
    this.filteredData$.subscribe(result => {
      this.searchValueEvent.emit(this.searchValue);
      this.dataSource.setData(result.treeData);
      const hasSearchValue = !!this.searchValue;
      if (hasSearchValue) {
        if (this.expandedNodes.length === 0) {
          this.expandedNodes = this.treeControl.expansionModel.selected;
          this.treeControl.expansionModel.clear();
        }
        this.treeControl.expansionModel.select(...result.needsToExpanded);
      } else {
        this.treeControl.expansionModel.clear();
        this.treeControl.expansionModel.select(...this.expandedNodes);
        this.expandedNodes = [];
      }
    });
  }

  ngOnInit(): void {
    // this.dataSource.setData(TREE_DATA);
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const { treeData, expandedKeys } = changes;
    if (treeData && treeData.currentValue && treeData.currentValue.length > 0) {
      const data: TreeNode[] = this.treeViewService.getTreeNodes(this.treeData);
      if (this.expandedKeys) {
        const allNodes = this.treeViewService.getAllTreeNodes(data);
        this.expandedNodes = allNodes.filter((n: TreeNode) => this.expandedKeys.includes(n.key));
      }
      this.originData$.next(data);
    }
  }

  leafItemSelectionToggle(node: ExampleTreeNode): void {
    console.log(123);
    if (this.showCheckbox) {

      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
    } else {
      this.nodeClick(node);
    }
  }

  itemSelectionToggle(node: ExampleTreeNode): void {
    if (this.showCheckbox) {
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);

      descendants.forEach(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
    } else {
      this.nodeClick(node);
    }
  }

  // 点击节点
  nodeClick(node: ExampleTreeNode) {
    const oldSelectedNode = this.selectListSelection.selected[0];
    const oldKey = oldSelectedNode && oldSelectedNode.key;
    this.selectListSelection.clear();
    this.selectListSelection.toggle(node);
    if (oldKey !== node.key) {
      this.nodeClickEvent.emit(node);
    }
  }

  checkAllParentsSelection(node: ExampleTreeNode): void {
    let parent: ExampleTreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: ExampleTreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: ExampleTreeNode): ExampleTreeNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getSelectedKeys(): any[] {
    const nodes = this.treeControl.dataNodes;
    const keys: any[] = [];
    nodes.forEach(node => {
      if (node.isLeaf) {
        if (this.checklistSelection.isSelected(node)) {
          keys.push(node.key);
        }
      } else {
        if (this.descendantsPartiallySelected(node) || this.descendantsAllSelected(node)) {
          keys.push(node.key);
        }
      }
    });
    return keys;
  }

  getOnlyCheckedParentKeys() {
    const nodes = this.treeControl.dataNodes;
    return this.getTest(nodes, 0);
  }

  getTest(nodes: ExampleTreeNode[], level: number) {
    let arr: ExampleTreeNode[] = [];
    const lnodes = nodes.filter(n => n.level === level);
    lnodes.forEach(node => {
      if (node.isLeaf) {
        if (this.checklistSelection.isSelected(node)) {
          arr.push(node);
        }
      } else {
        if (this.descendantsAllSelected(node)) {
          arr.push(node);
        } else {
          const descendants = this.treeControl.getDescendants(node);
          const children = this.getTest(descendants, node.level + 1);
          arr = arr.concat(children);
        }
      }
    });
    return arr;
  }

  selectAllNodes(value: boolean) {
    const nodes = this.treeControl.dataNodes;
    const lnodes = nodes.filter(n => n.level === 0);
    if (value) {
      nodes.forEach(node => {
        this.checklistSelection.select(node);
      })
    } else {
      nodes.forEach(node => {
        this.checklistSelection.clear();
      })
    }
  }
}


