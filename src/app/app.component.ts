import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzIconService } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private nzIconService: NzIconService,
    private translate: TranslateService) {
    this.translate.setDefaultLang('zh-CN');
    this.nzIconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_3227979_iq7ukq8i3nt.js?spm=a313x.7781069.1998910419.48&file=font_3227979_iq7ukq8i3nt.js'
    });
  }
}
