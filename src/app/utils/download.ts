function isImageInChromeNotEdge(fType: string) {
    let bool = false;
    if (window.navigator.userAgent.indexOf('Chrome') !== -1
        && window.navigator.userAgent.indexOf('Edge') === -1
        && (fType === 'jpg' || fType === 'gif'
            || fType === 'png' || fType === 'bmp'
            || fType === 'jpeg' || fType === 'svg')) {
        bool = true;
    }
    return bool;
}

function downloadNormalFile(src: string, filename: string) {
    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.style.display = 'none';
    link.href = src;
    const type = getBrowserType();
    if (type !== 'FF' && type !== 'Chrome') {
        link.target = '_blank';
    }
    // link.target = '_blank';
    document.body.appendChild(link); // 添加到页面中，为兼容Firefox浏览器
    link.click();
    document.body.removeChild(link); // 从页面移除
}


function imgTodataURL(url: string, filename: string, fileType: string) {
    getBase64(url, fileType).then(_baseUrl => {
        // 创建隐藏的可下载链接
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 图片转base64地址
        eleLink.href = _baseUrl;
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    });
}

function getBase64(url: string, fileType: string): Promise<string> {
    return new Promise(resolve => {
        // 通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片
        // tslint:disable-next-line:prefer-const
        let Img = new Image();
        let dataURL = '';
        Img.src = url;
        Img.setAttribute('crossOrigin', 'Anonymous');
        Img.onload = () => { // 要先确保图片完整获取到，这是个异步事件
            const canvas = document.createElement('canvas'); // 创建canvas元素
            const width = Img.width; // 确保canvas的尺寸和图片一样
            const height = Img.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d')!.drawImage(Img, 0, 0, width, height); // 将图片绘制到canvas中
            dataURL = canvas.toDataURL('image/' + fileType); // 转换图片为dataURL
            resolve(dataURL);
        };
    });
}

function getBrowserType() {
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
        return 'Opera';
    } // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF';
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari';
    } // 判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        return 'IE';
    } // 判断是否IE浏览器
    return '';
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    downloadNormalFile(url, filename);
}

export function download(src: string) {
    const _src = src.split('?')[0];
    const _urlArr = _src.split('/');
    const _file = _urlArr[_urlArr.length - 1];
    if (_file.indexOf('.') > -1) {
        const fType = _file.split('.')[1];
        if (isImageInChromeNotEdge(fType)) {
            imgTodataURL(src, _file, fType);
        } else {
            console.log(123);
            downloadNormalFile(src, _file);
        }
    }
}

export function downloadHasFetch(url: string, filename: string) {
    if (fetch) {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                let a = document.createElement('a')
                let url = URL.createObjectURL(blob)
                a.href = url
                a.download = filename
                a.click()
            })
    } else {
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.download = filename
        a.click()
    }
}