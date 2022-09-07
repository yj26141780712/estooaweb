import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';
import { ProfileComponent } from './profile/profile.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProfileAccountComponent } from './profile-account/profile-account.component';
import { ProfileLogComponent } from './profile-log/profile-log.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { InformationComponent } from './information/information.component';
import { MessageComponent } from './message/message.component';
import { InformationFormComponent } from './information-form/information-form.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DatePickerModule } from 'src/app/components/date-picker/date-picker.module';
import { AttachmentFormComponent } from './attachment-form/attachment-form.component';

@NgModule({
  declarations: [
    GeneralComponent,
    ProfileComponent,
    AttachmentComponent,
    ProfileAccountComponent,
    ProfileLogComponent,
    InformationComponent,
    MessageComponent,
    InformationFormComponent,
    AttachmentFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralRoutingModule,
    NzMenuModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzDropDownModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzIconModule,
    NzTableModule,
    NzTabsModule,
    NzPipesModule,
    NzImageModule,
    NzSelectModule,
    NzUploadModule,
    NzModalModule,
    DatePickerModule
  ]
})
export class GeneralModule { }
