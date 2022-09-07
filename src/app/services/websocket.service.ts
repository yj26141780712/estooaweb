import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  initSocket(url: string, callback: (e: any) => void) {
    const obj: any = {};
    obj.timeout = 10000;
    obj.isConnect = false;
    obj.closing = false;
    obj.url = '';
    obj.socket = null;
    obj.createSocket = function (url: string) {
      try {
        this.url = url;
        this.socket = new WebSocket(this.url);
        this.initEventHandle();
      } catch (e) {
        this.reConnect();
      }
    }
    obj.reConnect = function () {
      if (this.isConnect) {
        return;
      }
      this.isConnect = true;
      setTimeout(() => {
        this.createSocket(this.url);
        this.isConnect = false;
      }, 2000);
    }
    obj.heartReset = function () {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
    };
    obj.heartStart = function () {
      this.heartReset();
      this.timeoutObj = setTimeout(() => {
        this.socket.send('ping');
        this.serverTimeoutObj = setTimeout(() => {
          this.socket.close();
        }, this.timeout);
      }, this.timeout);
    };
    obj.close = function () {
      this.closing = true;
      this.socket.close();
    };
    obj.initEventHandle = function () {
      this.socket.addEventListener('close', (e: any) => {
        this.socket = null;
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
        this.heartReset();
        if (this.closing) {
          return;
        }
        this.reConnect();
      });
      this.socket.addEventListener('error', (e: any) => {
        console.log('连接出错,重新连接');
        this.reConnect();
      });
      this.socket.addEventListener('open', (e: any) => {
        console.log('连接打开');
      });
      this.socket.addEventListener('message', (e: any) => {
        this.heartReset();
        this.heartStart();
        if (e.data === "pong") {
          return;
        }
        // 此处编写业务逻辑代码
        // 数据拆包需确定
        callback(e);
      });
    }
    obj.createSocket(url);
    return obj;
  }
}
