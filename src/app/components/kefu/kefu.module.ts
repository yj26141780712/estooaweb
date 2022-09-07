import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KefuComponent } from './kefu.component';
import { KefuIconComponent } from './kefu-icon/kefu-icon.component';
import { KefuFormComponent } from './kefu-form/kefu-form.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { KefuMessageComponent } from './kefu-message/kefu-message.component';
import { KefuMessageListComponent } from './kefu-message-list/kefu-message-list.component';
import { KefuSessionListComponent } from './kefu-session-list/kefu-session-list.component';
import { KefuSessionComponent } from './kefu-session/kefu-session.component';
import { MessageTextComponent } from './kefu-message/message-text/message-text.component';
import { MessageFileComponent } from './kefu-message/message-file/message-file.component';
import { MessageImageComponent } from './kefu-message/message-image/message-image.component';
import { MessageStatusIconComponent } from './kefu-message/message-status-icon/message-status-icon.component';
import { MessageBubbleComponent } from './kefu-message/message-bubble/message-bubble.component';
import { MessageSendBoxComponent } from './kefu-message/message-send-box/message-send-box.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { MessageVideoComponent } from './kefu-message/message-video/message-video.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { MessageCustomComponent } from './kefu-message/message-custom/message-custom.component';

@NgModule({
  declarations: [
    KefuComponent,
    KefuIconComponent,
    KefuFormComponent,
    KefuMessageComponent,
    KefuMessageListComponent,
    KefuSessionListComponent,
    KefuSessionComponent,
    MessageTextComponent,
    MessageFileComponent,
    MessageImageComponent,
    MessageStatusIconComponent,
    MessageBubbleComponent,
    MessageSendBoxComponent,
    MessageVideoComponent,
    MessageCustomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzAvatarModule,
    NzDropDownModule,
    NzEmptyModule,
    NzIconModule,
    NzInputModule,
    NzToolTipModule,
    NzImageModule,
    NzUploadModule,
    NzProgressModule,
    NzPipesModule,
    NzPopoverModule,
    NzModalModule,
    NzBadgeModule
  ],
  exports: [
    KefuComponent,
    KefuIconComponent,
    KefuFormComponent
  ]
})
export class KefuModule { }
