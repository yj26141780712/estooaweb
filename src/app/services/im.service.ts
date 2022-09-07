import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import * as Tim from 'tim-js-sdk';
import * as TimUploadPlugin from 'tim-upload-plugin';
import { environment } from 'src/environments/environment';

export const TimTypes = {
  msgText: 'TIMTextElem',
  msgImage: 'TIMImageElem',
  msgFILE: 'TIMFileElem',
  msgVideo: 'TIMVideoFileElem'
}


@Injectable({
  providedIn: 'root'
})
export class TimService {

  tim: any;
  sig: string = '';
  TIM = Tim;
  onMessageReceived = (e: any) => { };
  onReadyStateUpdate = (e: any) => { };
  onUpdateConversationList = (e: any) => { };
  onMessageReadByPeer = (e: any) => { };
  constructor(private httpService: HttpService) {

  }



  initTim(userId: string, cb: () => void) {

    //获取用户Sig 创建tim实例  初始监听 默认登录
    this.genSig(userId).subscribe(json => {
      if (json.code === 200) {
        this.sig = json.data.UserSig;
        this.tim = Tim.create({
          SDKAppID: json.data.SDKAppID
        });
        this.tim.registerPlugin({
          'tim-upload-plugin': TimUploadPlugin
        });
        this.tim.setLogLevel(environment.timLevel);
        this.initListener();
        cb();
      }
    });
  }

  initListener() {
    this.tim.on(Tim.EVENT.SDK_READY, this.onReadyStateUpdate);
    this.tim.on(Tim.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList);
    this.tim.on(Tim.EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
    this.tim.on(Tim.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer);
  }

  genSig(timUserId: string) {
    return this.httpService.httpGetObservable('tim/genSig', {
      timUserId
    });
  }

  login(userId: string): Promise<any> {
    return this.tim.login({
      userID: userId,
      userSig: this.sig
    });
  }

  getMyProfile(): Promise<any> {
    return this.tim.getMyProfile();
  }

  /**
   * 会话设置已读
   * @param conversationID 会话id
   * @returns 
   */
  setMessageRead(conversationID: string) {
    return this.tim.setMessageRead({ conversationID });
  }

  /**
   * 获取会话信息
   * @param conversationID 会话id
   * @returns 
   */
  getConversationProfile(conversationID: string): Promise<any> {
    return this.tim.getConversationProfile(conversationID);
  }

  getMessageList(conversationID: string, nextReqMessageID = '', count = 15): Promise<any> {
    return this.tim.getMessageList({
      conversationID,
      nextReqMessageID,
      count
    });
  }

  createTextMessage(to: string, type: string, text: string) {
    return this.tim.createTextMessage({
      to,
      conversationType: type,
      payload: {
        text
      }
    });
  }

  createImageMessage(to: string, type: string, file: any, onProgress: (precent: number) => void) {
    return this.tim.createImageMessage({
      to,
      conversationType: type,
      payload: {
        file
      },
      onProgress
    })
  }

  createFileMessage(to: string, type: string, file: any, onProgress: (precent: number) => void) {
    return this.tim.createFileMessage({
      to,
      conversationType: type,
      payload: {
        file
      },
      onProgress
    })
  }

  createVideoMessage(to: string, type: string, file: any, onProgress: (precent: number) => void) {
    return this.tim.createVideoMessage({
      to,
      conversationType: type,
      payload: {
        file
      },
      onProgress
    })
  }

  sendMessage(message: any): Promise<any> {
    return this.tim.sendMessage(message);
  }

  reSendMessage(message: any): Promise<any> {
    return this.tim.resendMessage(message);
  }

  filterCallingMessage(currentMessageList: any[]) {
    currentMessageList.forEach((item) => {
      if (item.callType) {   // 对于自己伪造的消息不需要解析
        return
      }
      if (item.type === Tim.TYPES.MSG_MERGER && item.payload.downloadKey !== '') {
        let promise = this.tim.downloadMergerMessage(item)
        promise.then(function (imResponse: any) {
          // 下载成功后，SDK会更新 message.payload.messageList 等信息
          item = imResponse
        }).catch(function (imError: any) {
          // 下载失败
          console.warn('downloadMergerMessage error:', imError)
        })
      }
      if (item.type === Tim.TYPES.MSG_CUSTOM) {
        let payloadData: any = {}
        try {
          payloadData = JSON.parse(item.payload.data)
        } catch (e) {
          payloadData = {}
        }
        // if (payloadData.businessID === 1) {
        //   if (item.conversationType === Tim.TYPES.CONV_GROUP) {
        //     if (payloadData.actionType === 5) {
        //       item.nick = payloadData.inviteeList ? payloadData.inviteeList.join(',') : item.from
        //     }
        //     let _text = window.trtcCalling.extractCallingInfoFromMessage(item)
        //     let group_text = `${_text}`
        //     item.type = Tim.TYPES.MSG_GRP_TIP
        //     let customData = {
        //       operationType: 256,
        //       text: group_text,
        //       userIDList: []
        //     }
        //     item.payload = customData//JSON.stringify(customData)
        //   }
        //   if (item.conversationType === Tim.TYPES.CONV_C2C) {
        //     let c2c_text = window.trtcCalling.extractCallingInfoFromMessage(item)
        //     let customData = {
        //       text: c2c_text
        //     }
        //     item.payload = customData//JSON.stringify(customData)
        //   }
        // }
      }
    });
  }
}
