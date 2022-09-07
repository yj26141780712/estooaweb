import { Injectable } from '@angular/core';
import { TreeNode } from './tree-view.component';

@Injectable({
  providedIn: 'root'
})
export class TreeViewService {

  constructor() { }

  getTreeNodes(datas: any[], parentId = 0): TreeNode[] {
    const arr: TreeNode[] = datas.filter(a => a.parentId === parentId).map(a => {
      return { name: a.name, key: a.id, parentId: a.parentId, level: a.level, origin: a.origin };
    });
    arr.forEach(a => {
      a.children = this.getTreeNodes(datas, a.key);
    });
    return arr;
  }

  getAllTreeNodes(nodes: TreeNode[]): TreeNode[] {
    let arr: any[] = [];
    nodes.forEach(node => {
      arr.push(node);
      if (node.children) {
        arr = arr.concat(this.getAllTreeNodes(node.children));
      }
    });
    return arr;
  }

  getKeyAndChildrenKeys(node: TreeNode) {
    let keys: any[] = [];
    keys.push(node.key);
    if (node.children) {
      node.children.forEach(n => {
        keys = keys.concat(this.getKeyAndChildrenKeys(n));
      });
    }
    return keys;
  }

  // 获取选中的叶子节点的key
  getLeafNodeKeys(nodes: any[]) {

  }

  // 获取选中的叶子节点以及父节点的key
  getAllNodeKeys(nodes: any[]) {

  }

  getNodeKeyAndChildrenKeys(node: TreeNode) {
    let keys: any[] = [];
    keys.push(node.key);
    if (node.children) {
      node.children.forEach(n => {
        keys = keys.concat(this.getKeyAndChildrenKeys(n));
      });
    }
    return keys;
  }
}
