import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './tree-view.component';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';

@NgModule({
    declarations: [
        TreeViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeViewModule,
        NzInputModule,
        NzIconModule,
        NzHighlightModule,
        NzNoAnimationModule
    ],
    exports: [
        TreeViewComponent
    ]
})
export class TreeViewModule { }
