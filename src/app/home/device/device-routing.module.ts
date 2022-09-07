import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataListComponent } from './data-list/data-list.component';
import { DescriptionComponent } from './description/description.component';
import { DeviceComponent as DRoot } from './device.component';
import { DeviceComponent } from './device/device.component';
import { ModelComponent } from './model/model.component';
import { VideoListComponent } from './video-list/video-list.component';

const routes: Routes = [
  {
    path: '',
    component: DRoot,
    children: [
      {
        path: 'model',
        component: ModelComponent
      },
      {
        path: 'device',
        component: DeviceComponent
      },
      {
        path: 'dataList',
        component: DataListComponent
      },
      {
        path: 'videoList',
        component: VideoListComponent
      },
      {
        path: 'description',
        component: DescriptionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
