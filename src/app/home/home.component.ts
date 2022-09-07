import { HomeService, HomeSettings } from './home.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { combineLatest, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { CustomReuseStrategy } from '../customReuseStrategy';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { AccountService } from '../api/account.service';
import { SocketIoService } from '../services/socket.io.service';
import { KefuService } from '../components/kefu/kefu.service';
import { CookieService } from '../services/cookie.service';
import { CACHE_TOKEN } from '../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  host: {
    '[class.app-home]': 'true'
  },
  // animations: [AnimationRoute]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  setting: HomeSettings = {
    menuTheme: 'light',
    collapsedWidth: 48,
    siderWidth: 200,
    headerWidth: '100%',
    siderHeader: true,
    showSider: true,
    fixedSider: false,
    showHeadCollapsedButton: false,
    fixedHeader: false,
    showManyTabs: false,
    fixedManyTabs: false,
    showSiderLogo: true,
    manyTabsWidth: '100%',
    showHeaderLogo: false,
    showHeaderMenu: false,
    zIndex99: false,
    showDrawerMenu: false
  };
  siderMenus: any[] = [];
  paddingLeft = 24;
  isCollapsed = false;
  destory$ = new Subject();
  restMenu: any;
  initTopMenu = false;
  restMenu$ = new Subject();
  tabs: any[] = [];
  tabSelectedIndex!: number;
  tabReloading = false;
  rightMenuTabIndex!: number;
  userBase: any;
  info: any;
  name!: string;
  @ViewChild('maincenter') maincenterEl!: ElementRef;

  get hidden() {
    if (typeof document.hasFocus !== 'function') {
      return document.hidden;
    }
    return !document.hasFocus();
  }

  constructor(private homeService: HomeService,
    private themeService: ThemeService,
    private nzDrawerService: NzDrawerService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private accountService: AccountService,
    private socketIoService: SocketIoService,
    private cookieService: CookieService,
    private kefuService: KefuService) {
    this.themeService.changeTheme.pipe(takeUntil(this.destory$)).subscribe(() => {
      const windowWidth = window.innerWidth;
      this.setTheme(windowWidth);
      if (this.setting.showHeaderMenu) {
        this.restMenu$.next('');
      }
    });
    combineLatest([
      this.homeService.$initMenu,
      this.restMenu$
    ]).pipe(takeUntil(this.destory$)).subscribe(values => {
      if (values[0]) { // 菜单初始化完成以后重置菜单
        console.log('重置菜单');
        this.restMenus();
      }
    });
    fromEvent(window, 'resize').pipe(debounceTime(30), takeUntil(this.destory$)).subscribe((event: any) => {
      const windowWidth = event && event.target && event.target.innerWidth;
      this.setTheme(windowWidth);
      if (this.setting.showHeaderMenu) {
        this.restMenu$.next('');
      }
    });
    combineLatest([
      this.homeService.$initMenu,
      this.router.events
    ]).pipe(takeUntil(this.destory$)).subscribe(values => {
      if (values[0]) { // 菜单初始化完成以后重置菜单
        const event = values[1];
        if (event instanceof NavigationEnd) {
          // 判断是否路由标签
          const routerTab = this.homeService.routerTabs.find(x => x.url === event.url);
          if (!routerTab) {
            return;
          }
          const index = this.tabs.findIndex(x => x.url === event.url);
          if (index > -1) {
            this.tabSelectedIndex = index;
          } else {
            this.tabs.push({ ...routerTab, routerLink: this.homeService.getRouterLink(routerTab.url) });
            this.tabSelectedIndex = this.tabs.length - 1;
          }
        }
      }
    });
    this.homeService.$initMenu.pipe(takeUntil(this.destory$)).subscribe(value => {
      if (value) {
        const arr = this.homeService.getSiderMenus(router.url);
        this.siderMenus = [...arr];
      }
    });
    this.accountService.getAccountDetail()
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          // 设置个人信息
          this.userBase = json.data;
          const name = this.userBase.name || 'User';
          this.name = new RegExp('^[\u4e00-\u9fa5]{0,}$').test(name)
            ? name.substring(name.length - 1) : name.substring(0, 1);
          this.homeService.setUserinfo(this.userBase);
          this.kefuService.info = {
            userId: this.userBase.account,
          };
          // 初始化socket
          this.initSocket();
        }
      });
  }

  ngOnInit(): void {
    this.themeService.changeTheme.next('');
    this.homeService.initMenu();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.closeSocket();
    this.destory$.next('');
    this.destory$.complete();
  }

  setTheme(windowWidth: number = 1200) {
    this.setting = this.homeService.getThemeSettings(this.isCollapsed, windowWidth);
  }

  //退出登录
  goLogin() {
    this.homeService.clearLoginInfo();
    this.router.navigate(['/login']);
  }

  goAccountSetting() {
    this.router.navigate(['/home/account/settings']);
  }

  toggleTheme(): void {
    this.nzDrawerService.create({
      nzTitle: '',
      nzContent: SettingDrawerComponent,
      nzWidth: 300,
      nzContentParams: {
      }
    });
  }

  restMenus() {
    setTimeout(() => {
      if (!this.initTopMenu) {
        const lis: HTMLElement[] = this.maincenterEl.nativeElement.children;
        if (lis.length > 0) {
          for (let i = 0; i < lis.length; i++) {
            console.log(lis[i].clientWidth);
            this.siderMenus[i].width = lis[i].clientWidth;
          }
          this.initTopMenu = true;
        }
      }
      let width = 64;
      let index = 0;
      for (let i = 0; i < this.siderMenus.length; i++) {
        const menuWidth = this.siderMenus[i] && this.siderMenus[i].width;
        width += menuWidth;
        if (width > this.maincenterEl.nativeElement.clientWidth) {
          break;
        }
        index = i;
      }
      this.siderMenus.forEach((m: any, i: number) => {
        m.style = index >= i ? { opacity: 1, order: i } : {
          opacity: 0,
          order: i,
          height: '0px',
          overflowY: 'hidden',
          pointerEvents: 'none',
          position: 'absolute'
        };
      });
      this.restMenu = {
        title: '',
        selected: false,
        icon: 'ellipsis',
        open: false,
        disabled: false,
        style: {
          opacity: index < this.siderMenus.length - 1 ? 1 : 0,
          order: index
        },
        children: this.siderMenus.map(a => {
          return { ...a, style: null };
        }).slice(index + 1)
      };
    });
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    const windowWidth = window.innerWidth;
    this.setting = this.homeService.getThemeSettings(this.isCollapsed, windowWidth);
  }

  closeDrawerMenu() {
    this.isCollapsed = true;
  }

  // 标签
  // 切换标签
  tabChangeIndex(index: number) {
    if (this.deletingTab) { // 关闭选项卡最后一个时 触发
      const selectedTab = this.tabs[this.tabSelectedIndex];
      if (selectedTab) {
        this.router.navigate([selectedTab.url]);
        this.deletingTab = false;
      }
    }
  }

  // 刷新标签
  reloadTab($event: MouseEvent, index: number) {
    $event.stopPropagation();
    $event.preventDefault();
    this.tabReloading = true;
    this.deleteRouters([this.tabs[index].url]);
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.router.navigate([this.tabs[index].url]);
    });
    setTimeout(() => {
      this.tabReloading = false;
    }, 2000);
  }

  // 关闭标签
  deletingTab = false;
  closeTab($event: MouseEvent, index: number) {
    $event.stopPropagation();
    $event.preventDefault();
    const deteledTabs = this.tabs.splice(index, 1);
    const selectedTab = this.tabs[this.tabSelectedIndex];
    this.deletingTab = true;
    if (selectedTab) {
      this.router.navigate([selectedTab.url]);
      this.deletingTab = false;
    }
    this.deleteRouters(deteledTabs.map(x => x.url));
  }

  // 右击菜单
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, index: number): void {
    this.rightMenuTabIndex = index;
    this.nzContextMenuService.create($event, menu);
  }

  // 关闭右击菜单
  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  closeOther(index: number): void { // 先关右边后关左边
    this.closeToRight(index);
    this.closeToLeft(index);
  }

  closeToLeft(index: number): void {
    const leftDeletedTabs = this.tabs.splice(0, index);
    if (index !== this.tabSelectedIndex && index > this.tabSelectedIndex) {
      this.tabSelectedIndex = 0;
      this.router.navigate([this.tabs[this.tabSelectedIndex].url]);
    }
    this.deleteRouters(leftDeletedTabs.map(x => x.url));
  }

  closeToRight(index: number): void {
    const rightDeletedTabs = this.tabs.splice(index + 1, this.tabs.length - index - 1);
    if (index !== this.tabSelectedIndex && index < this.tabSelectedIndex) {
      this.tabSelectedIndex = index;
      this.router.navigate([this.tabs[this.tabSelectedIndex].url]);
    }
    this.deleteRouters(rightDeletedTabs.map(x => x.url));
  }

  deleteRouters(urls: string[]) {
    urls.forEach((url: string) => {
      CustomReuseStrategy.deleteRouteSnapshot(url);
    });
  }

  initSocket() {
    //监听客事件;
    this.socketIoService.onEventConnetction = this.onEventConnetction;
    this.socketIoService.addLister(this.kefuService.wsEvent, this.kefuService.onEventCustomerService)
    const token = this.cookieService.getCookie(CACHE_TOKEN);
    this.socketIoService.createSocket('ws://10.65.30.100:8000', {
      path: '/ws/',
      query: {
        "token": token
      }
    });
    this.kefuService.send$.pipe(takeUntil(this.destory$))
      .subscribe(data => {
        this.socketIoService.sendMessage(this.kefuService.wsEvent, data);
      });
  }

  onEventConnetction = () => {
    this.kefuService.onInit();
  }

  closeSocket() {
    this.socketIoService.close();
  }
}
