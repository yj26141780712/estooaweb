import { Component, OnInit } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NavigationMode, ThemeService, ThemeSetting, ThemeType } from 'src/app/theme.service';

@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.less']
})
export class SettingDrawerComponent implements OnInit {

  isCollapsed = false;
  themes: ThemeType[] = [ThemeType.default, ThemeType.dark, ThemeType.red];
  navigationModes: NavigationMode[] = [NavigationMode.siderMenu, NavigationMode.topMenu, NavigationMode.mixinMenu];
  setting: ThemeSetting;
  constructor(private drawerRef: NzDrawerRef<string>,
    private themeService: ThemeService) {
    this.setting = this.themeService.setting;
  }

  ngOnInit(): void {
  }

  selectTheme(theme: ThemeType) {
    // this.setting.currentTheme = theme;
    this.themeService.toggleTheme(theme).then(() => {
      this.themeService.changeTheme.next('');
    });
  }

  selectMode(mode: NavigationMode) {
    this.setting.currentNavigationMode = mode;
    // 混合模式头部必须固定
    if (this.setting.currentNavigationMode === NavigationMode.mixinMenu) {
      this.setting.fixedHeader = true;
    }
    this.themeService.changeTheme.next('');
  }

  close() {
    this.drawerRef.close();
  }

  changeSetting() {
    if (!this.setting.fixedHeader) { // 固定多标签时 header 也固定
      this.setting.fixedManytabs = false;
    }
    if (!this.setting.showManytabs) {
      this.setting.fixedManytabs = false;
    }
    this.themeService.changeTheme.next('');
  }
}
