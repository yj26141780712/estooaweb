import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  sio!: Socket;
  heartTimer: any;
  closeTimer: any;
  heartTime = 10000;
  refreshCustomerService = new Subject<void>();
  onEventCustomerService = (data: any) => { };
  onEventConnetction = () => { };
  listers: { event: string, func: (data: any) => void }[] = [];
  constructor() {

  }

  createSocket(url: string, option: Partial<ManagerOptions & SocketOptions>) {
    this.sio = io(url, option);
    this.sio.on('connect', () => {
      this.resetHeart();
      this.startHeart();
      if (this.onEventConnetction) {
        this.onEventConnetction();
      }
    });
    this.sio.on('disconnect', (reason) => {
      this.resetHeart();
    });
    this.sio.on('connect_error', () => {
      console.log('连接错误');
    });
    this.sio.on('exception', (error: any) => {
      console.log(error);
    });
    this.sio.on('error', (error: any) => {
      console.log(error);
    });
    this.sio.on('pong', (error: any) => {
      this.resetHeart();
      this.startHeart();
    });
    this.listers.forEach(l => {
      this.sio.on(l.event, l.func);
    });
  }

  addLister(event: string, func: (data: any) => void) {
    this.listers.push({ event, func });
  }

  sendMessage(event: string, data: any) {
    this.sio.emit(event, data);
  }

  resetHeart() {
    clearTimeout(this.heartTimer);
    clearTimeout(this.closeTimer);
  }

  startHeart() {
    this.heartTimer = setTimeout(() => {
      this.sio.emit('ping');
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.heartTime);
    }, this.heartTime)
  }

  close() {
    if (this.sio && this.sio.connected) {
      this.sio.connected = false;
      this.sio.disconnect();
    }
    this.sio.close();
    (this.sio as any) = null;
  }
}
