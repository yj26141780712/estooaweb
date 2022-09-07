import { Injectable } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import { CACHE_AUTO_LOGIN, CACHE_REFRESH_TOKEN, CACHE_TOKEN, CACHE_USERINFO } from '../services/global';
import { ThemeService } from '../theme.service';
import { BehaviorSubject } from 'rxjs';
import { NzMenuThemeType } from 'ng-zorro-antd/menu';
import { AccountService } from '../api/account.service';

export interface HomeSettings {
  menuTheme: NzMenuThemeType;
  collapsedWidth: number;
  siderWidth: number;
  headerWidth: string;
  siderHeader: boolean;
  showSider: boolean;
  fixedSider: boolean;
  fixedHeader: boolean;
  showHeadCollapsedButton: boolean;
  showManyTabs: boolean;
  fixedManyTabs: boolean;
  manyTabsWidth: string;
  showSiderLogo: boolean;
  showHeaderLogo: boolean;
  showHeaderMenu: boolean;
  zIndex99: boolean;
  showDrawerMenu: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  init = false;
  mobileWidth = 768;
  siderWidth = 200;
  collapsedWidth = 48;
  routerTabs: any[] = [];
  menus: any[] = [];
  selectedMenu: any;
  menuInit = false;
  menuIniting = false;
  $initMenu = new BehaviorSubject<boolean>(false);
  constructor(private accountService: AccountService,
    private cookieService: CookieService,
    private themeService: ThemeService) { }

  initMenu(url: string = '') {
    if (this.menuInit) {
      console.log('菜单初始化完成');
      return;
    }
    if (this.menuIniting) {
      console.log('正在加载中');
      return;
    }
    this.menuIniting = true;
    this.accountService.getMenuList().subscribe(json => {
      const homeMenu = {
        level: 1,
        selected: false,
        icon: 'home',
        title: '数据中心',
        open: false,
        disabled: false,
        routerLink: ['/', 'home', 'workplace'],
        url: '/home/workplace',
        parent: null
      };
      if (json.code === 200) {
        this.routerTabs = [{ url: '/home/workplace', title: '数据中心' }].concat(json.data.filter((x: any) => x.url).map((a: any) => {
          return { url: a.url, title: a.name };
        }));
        console.log(this.routerTabs);
        this.menus = [homeMenu].concat(this.createMenus(json.data, 0, 1));
      } else {
        this.menus = [homeMenu];
      }
      this.setOpenAndSelected(this.menus, url);
      this.menuIniting = false;
      this.menuInit = true;
      this.$initMenu.next(true);
    });
  }

  getSiderMenus(selecedUrl: string) {
    this.setOpenAndSelected(this.menus, selecedUrl);
    return this.menus;
  }

  setOpenAndSelected(menus: any, url: string) {
    this.setSeleced(menus, url);
    this.setParentMenuOpen(this.selectedMenu && this.selectedMenu.parent);
  }

  setSeleced(menus: any, url: string) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.children && menu.children.length > 0) {
        this.setSeleced(menu.children, url);
      } else {
        if (menu.url === url) {
          menu.selected = true;
          this.selectedMenu = menu;
        } else {
          menu.selected = false;
        }
      }
    }
  }

  setParentMenuOpen(menu: any) {
    if (menu) {
      menu.open = true;
      if (menu.parent) {
        this.setParentMenuOpen(menu.parent);
      }
    }
  }

  createMenus(list: any[], parentId: number, level = 1, parentMenu: any = null) {
    const arr: any[] = [];
    const parents = list.filter(x => x.parentId === parentId).sort((a, b) => a.sort - b.sort);
    parents.forEach(p => {
      const routerLink = this.getRouterLink(p.url);
      const menu: any = {
        level,
        selected: false,
        icon: p.icon,
        title: p.name,
        open: false,
        disabled: false,
        routerLink,
        url: p.url,
        parent: parentMenu
      };
      const children = this.createMenus(list, p.id, level + 1, menu);
      menu.children = children && children.length > 0 ? children : null;
      arr.push(menu);
    });
    return arr;
  }

  getRouterLink(url: string) {
    const routerLink = url.split('/');
    routerLink[0] = '/';
    return routerLink;
  }

  clearLoginInfo() {
    this.menuInit = false;
    this.menuIniting = false;
    this.menus = [];
    localStorage.setItem(CACHE_USERINFO, '');
    localStorage.setItem(CACHE_AUTO_LOGIN, 'false');
    this.cookieService.delCookie(CACHE_REFRESH_TOKEN);
    this.cookieService.delCookie(CACHE_TOKEN);
  }

  getThemeSettings(collapsed: boolean = false, windowWidth: number): HomeSettings {
    // 非头部菜单显示 侧边栏
    let showSider = this.themeService.setting.currentNavigationMode !== 'topMenu';
    const siderWidth = this.siderWidth;
    const collapsedWidth = this.collapsedWidth;
    const fixedSider = !!this.themeService.setting.fixedSidebar;
    const fixedHeader = !!this.themeService.setting.fixedHeader;
    let showHeadCollapsedButton = this.themeService.setting.currentNavigationMode === 'siderMenu';
    let headerWidth = this.themeService.setting.currentNavigationMode === 'siderMenu'
      && fixedHeader ? `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)` : '100%';
    const siderHeader = this.themeService.setting.currentNavigationMode === 'siderMenu';
    const showManyTabs = !!this.themeService.setting.showManytabs;
    const fixedManyTabs = !!this.themeService.setting.fixedManytabs;
    const showSiderLogo = this.themeService.setting.currentNavigationMode === 'siderMenu';
    let manyTabsWidth = (
      this.themeService.setting.currentNavigationMode === 'siderMenu'
      || this.themeService.setting.currentNavigationMode === 'mixinMenu')
      && fixedManyTabs ? `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)` : '100%';
    let showHeaderLogo = this.themeService.setting.currentNavigationMode !== 'siderMenu';
    let showHeaderMenu = this.themeService.setting.currentNavigationMode === 'topMenu';
    const menuTheme = (this.themeService.setting.currentTheme === 'default'
      || (this.themeService.setting.currentTheme === 'dark' && this.themeService.setting.currentNavigationMode === 'mixinMenu')) ? 'light' : 'dark';
    const zIndex99 = this.themeService.setting.currentNavigationMode !== 'siderMenu';
    let showDrawerMenu = false;
    if (windowWidth <= this.mobileWidth) {
      showSider = false;
      showHeadCollapsedButton = true;
      showDrawerMenu = true;
      showHeaderMenu = false;
      showHeaderLogo = true;
      headerWidth = '100%';
      manyTabsWidth = '100%';
    }
    return {
      menuTheme,
      collapsedWidth,
      siderWidth,
      headerWidth,
      siderHeader,
      showSider,
      fixedHeader,
      showHeadCollapsedButton,
      fixedSider,
      showManyTabs,
      fixedManyTabs,
      showSiderLogo,
      manyTabsWidth,
      showHeaderLogo,
      showHeaderMenu,
      zIndex99,
      showDrawerMenu
    };
  }

  setUserinfo(info: any) {
    localStorage.setItem(CACHE_USERINFO, JSON.stringify(info));
  }

  getUserinfo() {
    const userinfoJson = localStorage.getItem(CACHE_USERINFO);
    return userinfoJson ? JSON.parse(userinfoJson) : {};
  }
}
