import { Injectable } from '@angular/core';
import { use } from 'echarts';
import { Subject } from 'rxjs';
import { TimService } from 'src/app/services/im.service';
import { KefuFormComponent } from './kefu-form/kefu-form.component';


export type CustomerServiceType = 'kefuInitSuccess' | 'requestSuccess' | 'refreshList';
export type OperationType = 'changeSession' | 'init' | 'requestSuccess';
export type sessionStatusType = 'online' | 'waiting' | 'history';

export interface KMessage {
  from: string;
  type: string;
  payload: any;
  message: KMessage;
  flow: string;
  time: number;
  status: string;
  progress: number;
  conversationType: string;
  isPeerRead: boolean;
  isRevoked: boolean;
  onProgress: (precent: number) => void;
  onSendCompleted: () => void;
  onRead: () => void;
}

export interface KLastMessage {
  lastTime: number;
  isRevoked: boolean;
  messageForShow: string;
}

export interface KUserProfile {
  userID: string;
  nick: string;
  avatar: string;
}

export interface KConversation {
  userID: string;
  conversationID: string;
  lastMessage: KLastMessage;
  unreadCount: number;
  type: string;
  userProfile: KUserProfile
}

export interface KLastMessage {
  messageForShow: string;
  lastTime: number;
  fromAccount: string;
}

export interface KSessionUser {
  userId: string;
  avatar: string;
}

export interface KSession {
  user: KSessionUser;
  conversationID: string;
  conversation: KConversation;
  type: string;
}

export interface Operation {
  type: OperationType;
  data: any;
}

export interface CustomerServiceMessage {
  type: CustomerServiceType,
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class KefuService {

  wsEvent = 'customer_service';
  form!: KefuFormComponent;
  info: any;
  sessions: KSession[] = [];
  // onlines: KSession[] = [];
  // histories: KSession[] = [];
  // waitings: KSession[] = [];
  selectedConversationID!: string; //选中会话
  selectedSession!: KSession;
  //当前会话信息
  currentConversation: any = {};
  currentMessageList: any[] = [];
  conversationList: KConversation[] = [];
  nextReqMessageID = '';
  isCompleted = false;
  // conversationList: any[] = [];
  updateInfo$ = new Subject<void>();
  operation$ = new Subject<Operation>();
  send$ = new Subject<any>();
  scrollToBottom$ = new Subject<void>();
  updateSessionList$ = new Subject<void>(); //更新会话列表
  updateMessageList$ = new Subject<void>(); //更新当前消息列表
  updateCurrentSession$ = new Subject<void>();
  imageLoad$ = new Subject<void>();
  openform$ = new Subject<void>();
  closeform$ = new Subject<void>();
  timTypes = this.timService.TIM.TYPES;

  constructor(private timService: TimService) {

  }

  openForm() {
    this.openform$.next();
  }

  closeForm() {
    this.closeform$.next();
  }

  isHidden() {
    if (typeof document.hasFocus !== 'function') {
      return document.hidden;
    }
    return !document.hasFocus();
  }

  //刷新会话列表
  updateConversationList(data: KConversation[]) {
    data.forEach(x => {
      const find = this.conversationList.find(y => y.conversationID === x.conversationID);
      if (find) {
        Object.assign(find, x)
      } else {
        this.conversationList.push(x);
      }
    });
  }

  //刷新会话信息

  addOnlines(session: KSession) {
    this.send$.next({
      type: 'addOnlines',
      userId: session.user.userId
    })
  }

  refreshOnlines() {
    this.sessions.forEach(x => {
      if (!x.conversation) {
        const conversation = this.conversationList.find(y => y.userProfile.userID === x.user.userId);
        if (conversation) {
          x.conversation = conversation;
          x.conversationID = conversation.conversationID;
        }
      }
    });
    // this.waitings.forEach(x => {
    //   if (!x.conversation) {
    //     const conversation = this.conversationList.find(y => y.userProfile.userID === x.user.userId);
    //     if (conversation) {
    //       x.conversation = conversation;
    //       x.conversationID = conversation.conversationID;
    //     }
    //   }
    // });
    // this.histories.forEach(x => {
    //   if (!x.conversation) {
    //     const conversation = this.conversationList.find(y => y.userProfile.userID === x.user.userId);
    //     if (conversation) {
    //       x.conversation = conversation;
    //       x.conversationID = conversation.conversationID;
    //     }
    //   }
    // });
  }

  onInit() { // 客服socket连接成功
    this.send$.next({
      type: 'kefuInit',
    });
  }

  closeSession(user: KSession) {
    this.send$.next({
      type: 'kefuEnd',
      userId: user.user.userId
    });
  }

  deleteSession(user: KSession) {
    this.send$.next({
      type: 'deleteSession',
      userId: user.user.userId
    });
  }

  //客服会话socket事件
  onEventCustomerService = (message: CustomerServiceMessage) => {
    if (message.type === 'kefuInitSuccess') { //收到初始化信息
      this.init(message);
    } else if (message.type === 'refreshList') {
      const list: KSession[] = message['data'];
      this.refreshSessionList(list);
    }
    // } else if (message.type === 'endSuccess') { //
    //   // const userId = message['userId'];
    //   // const findIndex = this.onlines.findIndex(x => x.user.userId === userId);
    //   // const session = this.onlines[findIndex];
    //   // this.onlines.splice(findIndex, 1);
    //   // this.histories.splice(0, 0, session);
    //   // this.updateSessionList$.next();
    // }
  }

  refreshSessionList(list: KSession[]) {
    list.forEach(x => {
      const findIndex = this.sessions.findIndex((y) => y.user.userId === x.user.userId);
      if (findIndex > -1) {
        x = { ...this.sessions[findIndex], type: x.type };
      }
    })
    this.sessions = [...list];
    this.refreshOnlines();
    this.updateSessionList$.next();
  }

  selectSession(session: KSession) {
    if (!session.conversationID) {
      session.conversationID = `C2C${session.user.userId}`;
    }
    if (session.conversationID === this.selectedConversationID) {
      return;
    }
    this.resetSession();
    const lastConversationID = this.selectedConversationID;
    this.selectedConversationID = session.conversationID;
    this.selectedSession = session;
    this.changeSession(lastConversationID)
  }

  init(data: any) {
    if (this.sessions.length === 0) {
      this.sessions = data.data;
    } else {
      this.refreshOnlines();
    }
    if (this.info) {
      const userId = this.info.userId;
      if (userId) {
        //登录成功后触发 SDK_READY 事件, 该事件触发后可以正常使用SDK接口
        this.timService.onReadyStateUpdate = this.onReadyStateUpdate;
        this.timService.onUpdateConversationList = this.onUpdateConversationList;
        this.timService.onMessageReceived = this.onMessageReceived;
        this.timService.onMessageReadByPeer = this.onMessageReadByPeer;
        this.timService.initTim(userId, this.initSuccess);
      }
    }
  }

  initSuccess = async () => {
    const loginres = await this.timService.login(this.info.userId);
  }

  onReadyStateUpdate = async (e: any) => {
    const resProfile = await this.timService.getMyProfile();
    if (resProfile.code === 0) {
      this.info = {
        ...this.info,
        nick: resProfile.data.nick,
        avatar: resProfile.data.avatar
      };
      this.updateInfo$.next();
    }
  }

  onUpdateConversationList = async (e: any) => {
    const data = e.data;
    if (data && Array.isArray(data)) {
      this.updateConversationList(data);
      this.refreshOnlines();
      this.updateSessionList$.next();
    }
  }

  onMessageReceived = async (e: any) => { //
    const data = e.data;
    this.pushCurrentMessageList(data);
  }

  onMessageReadByPeer = async (e: any) => {
    const data = e.data;
    if (Array.isArray(data)) {
      data.forEach(x => {
        if (x.onRead) {
          x.onRead();
        }
      });
    }
  }


  pushCurrentMessageList(data: any) {
    if (!this.currentConversation.conversationID) {
      return;
    }
    if (Array.isArray(data)) {
      const result = data.filter(x => x.conversationID === this.currentConversation.conversationID);
      this.currentMessageList = [...this.currentMessageList, ...result];
      this.timService.filterCallingMessage(this.currentMessageList);
      this.updateMessageList$.next();
    } else if (data.conversationID === this.currentConversation.conversationID) {
      this.currentMessageList = [...this.currentMessageList, data];
      this.timService.filterCallingMessage(this.currentMessageList);
      this.updateMessageList$.next();
    }
  }


  getMessageList(init: boolean = false) {
    if (this.isCompleted) {
      return;
    }
    this.timService.getMessageList(this.selectedConversationID, this.nextReqMessageID)
      .then(({ data }) => {
        this.nextReqMessageID = data.nextReqMessageID;
        this.isCompleted = data.isCompleted;
        this.currentMessageList = [...data.messageList, ...this.currentMessageList];
        this.timService.filterCallingMessage(this.currentMessageList);
        this.updateMessageList$.next();
        if (init) {
          this.scrollToBottom$.next();
          console.log('发送滚动')
        }
      });
  }

  //更新当前会话
  updateCurrentSession(conversation: any) {
    this.currentConversation = conversation;
    this.currentMessageList = [];
    this.nextReqMessageID = '';
    this.isCompleted = false;
    this.updateCurrentSession$.next();
  }

  //重置会话
  resetSession() {
    this.selectedConversationID = '';
    (this.selectedSession as any) = null;
    this.currentConversation = {};
    this.currentMessageList = [];
    this.nextReqMessageID = '';
    this.isCompleted = false;
    this.updateCurrentSession$.next();
    // this.conversationList = [];
  }

  //切换会话
  changeSession(lastConversationID: string) {
    //1.切换会话前 将切换前的会话进行已读上报
    if (lastConversationID) {
      console.log('setMessageRead,' + lastConversationID);
      this.timService.setMessageRead(lastConversationID);
    }
    //2.带切换的会话进行已读上报
    this.timService.setMessageRead(this.selectedConversationID);
    //3.获取会话信息
    this.timService.getConversationProfile(this.selectedConversationID)
      .then(({ data }) => {
        // 更新当前会话
        this.updateCurrentSession(data.conversation);
        // 获取消息列表
        this.getMessageList(true);
      }).catch(err => {
        console.log(err);
        this.updateMessageList$.next();
      });
  }

  //设置当前会话的消息已读
  setCurrentConversationMessageRead() {
    const unReadCount = this.currentConversation.unreadCount;
    if (!this.isHidden() && unReadCount > 0) {
      this.timService.setMessageRead(this.currentConversation.conversationID);
    }
  }

  sendTextMessage(text: string) {
    const userId = this.selectedSession.user.userId;
    const message = this.timService.createTextMessage(
      userId,
      this.currentConversation.type,
      text
    );
    this.pushCurrentMessageList(message);
    this.scrollToBottom$.next();
    this.sendMessage(message);
  }

  sendImageMessage(file: any) {
    const userId = this.selectedSession.user.userId;
    const message = this.timService.createImageMessage(
      userId,
      this.currentConversation.type,
      file,
      (precent: number) => {
        if (message.onProgress) {
          message.onProgress(precent);
        }
      }
    );
    this.pushCurrentMessageList(message);
    this.scrollToBottom$.next();
    this.sendMessage(message);
  }

  sendVideoMessage(file: any) {
    const userId = this.selectedSession.user.userId;
    const message = this.timService.createVideoMessage(
      userId,
      this.currentConversation.type,
      file,
      (precent: number) => {
        if (message.onProgress) {
          message.onProgress(precent);
        }
      }
    );
    this.pushCurrentMessageList(message);
    this.scrollToBottom$.next();
    this.sendMessage(message);
  }

  sendFileMessage(file: any) {
    const userId = this.selectedSession.user.userId;
    const message = this.timService.createFileMessage(
      userId,
      this.currentConversation.type,
      file,
      (precent: number) => {
        if (message.onProgress) {
          message.onProgress(precent);
        }
      }
    );
    this.pushCurrentMessageList(message);
    this.scrollToBottom$.next();
    this.sendMessage(message);
  }

  sendMessage(message: any) {
    this.timService.sendMessage(message)
      .then(() => {
        if (message.onSendCompleted) {
          message.onSendCompleted();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  reSendMessage(message: any) {
    this.timService.reSendMessage(message)
      .then(() => {
        if (message.onSendCompleted) {
          message.onSendCompleted();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
