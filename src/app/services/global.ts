import { environment } from 'src/environments/environment';

/**
 * 全局变量
 */
export class Global {
    static domain = environment.domain;
    static language = 'zh';
    static tokenIsInvalid = true; // true 表示token未被验证无效  false 表示token被验证无效 无需重复提示
    static userinfo: any = {};
    static login = false;
    static routerUrl = '';
    static isManager = {};
}

export const deleteConfirm = {
    neTitle: '确定要删除？',
    neContent: null,
    neOkText: '确定',
    neOkType: 'danger',
    neCancelText: '取消',
    neOnCancel: () => { },
    neNoAnimation: true,
};

export const CACHE_SYSTEM = 'estooaweb';

export const CACHE_USERNAME = 'estooaweb-username';

export const CACHE_USERINFO = 'estooaweb-userinfo';

export const CACHE_REFRESH_TOKEN = 'estooaweb-refresh-token';

export const CACHE_TOKEN = 'estooaweb-token';

export const CACHE_REFRESH_TOKEN_TIME = 60 * 24 * 120;

export const CACHE_TOKEN_TIME = 90;

export const CACHE_THEME_SETTINGS = `${CACHE_SYSTEM}-theme-settings`;

export const CACHE_AUTO_LOGIN = `${CACHE_SYSTEM}-auto`;

export const CACHE_MENU_ACTIONS_ID = 50; //页面操作权限字典id

export const CACHE_ACCOUNT_TYPE_ID = 47; //账号类型字典id

export const CACHE_ACCOUNT_LEVEL_ID = 44;  //账号等级字典id



