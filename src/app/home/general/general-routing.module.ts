import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentComponent } from './attachment/attachment.component';
import { GeneralComponent } from './general.component';
import { InformationComponent } from './information/information.component';
import { MessageComponent } from './message/message.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'attachment',
        component: AttachmentComponent
      },
      {
        path: 'information',
        component: InformationComponent
      },
      {
        path: 'message',
        component: MessageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
