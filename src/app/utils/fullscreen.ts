//打开全屏方法
export function openFullscreen(element: any) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}

//退出全屏方法
export function exitFullScreen() {
    const doc: any = document;
    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
        doc.msExiFullscreen();
    } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    }
}

export function isFullscreenForNoScroll() {
    var explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('chrome') > 0) {
        if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
            return true;
        } else {
            return false
        }
    } else {//IE 9+  fireFox
        if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
            return true;
        } else {
            return false
        }
    }
}
