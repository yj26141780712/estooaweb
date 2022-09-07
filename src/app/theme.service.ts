import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CACHE_THEME_SETTINGS } from './services/global';

// 主题模式
export enum ThemeType {
  dark = 'dark',
  default = 'default',
  red = 'red'
}

// 导航模式
export enum NavigationMode {
  siderMenu = 'siderMenu',
  topMenu = 'topMenu',
  mixinMenu = 'mixinMenu'
}

export interface ThemeSetting {
  currentTheme?: ThemeType;
  currentNavigationMode?: NavigationMode;
  fixedHeader?: boolean;
  fixedSidebar?: boolean;
  showManytabs?: boolean;
  fixedManytabs?: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  oldTheme: ThemeType | undefined;
  setting: ThemeSetting = {
    currentTheme: ThemeType.default,
    currentNavigationMode: NavigationMode.siderMenu,
    fixedHeader: false,
    fixedSidebar: false,
    showManytabs: false,
    fixedManytabs: false
  };
  changeTheme = new Subject<any>();
  constructor() {
    this.changeTheme.subscribe(() => {
      localStorage.setItem(CACHE_THEME_SETTINGS, JSON.stringify(this.setting));
    });
  }

  /**
   * 初始化主题
   */
  initTheme() {
    const json = localStorage.getItem(CACHE_THEME_SETTINGS);
    if (json) {
      const obj = JSON.parse(json);
      this.setting = { ...obj };
    }
  }

  private reverseTheme(theme: string): ThemeType {
    switch (theme) {
      case 'dark':
        return ThemeType.dark;
      case 'red':
        return ThemeType.red;
      default:
        return ThemeType.default;
    }
  }

  private removeUnusedTheme(theme: ThemeType | undefined): void {
    if (theme) {
      document.documentElement.classList.remove(theme);
      const removedThemeStyle = document.getElementById(theme);
      if (removedThemeStyle) {
        document.head.removeChild(removedThemeStyle);
      }
    }
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  public loadTheme(firstLoad = true): Promise<Event> {
    const theme = this.setting.currentTheme || 'default';
    if (firstLoad) { // 首次加载
      document.documentElement.classList.add(theme);
    }
    return new Promise<Event>((resolve, reject) => {
      this.loadCss(`${theme}.css?t=${new Date().getTime()}`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
            this.removeUnusedTheme(this.oldTheme);
          }
          resolve(e);
        },
        (e) => reject(e)
      );
    });
  }

  public toggleTheme(theme: string = ThemeType.default): Promise<Event> {
    if (theme === this.setting.currentTheme) { // 主题相同
      return Promise.resolve(new Event(''));
    }
    this.oldTheme = this.setting.currentTheme;
    this.setting.currentTheme = this.reverseTheme(theme);
    return this.loadTheme(false);
  }

}
