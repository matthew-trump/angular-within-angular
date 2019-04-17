import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChildService {

  constructor(@Inject(DOCUMENT) private document: any) { }
  requestId: number = 1;
  message$: BehaviorSubject<string> = new BehaviorSubject(null);
  callback$: BehaviorSubject<any> = new BehaviorSubject(null);

  get child() {
    return this.document.getElementById('iframe').contentWindow;
  }
  public getMessageCallback() {
    return this.handleMessageFromChild.bind(this);
  }
  public handleMessageFromChild(event: any) {
    console.log("CHILD SERVICE RECEIVED MESSAGE FROM IFRAME", event.data.type, event.data.message, event);
    if (event.data.type === 'send_message') {
      this.message$.next(event.data.message);
    } else if (event.data.type === 'onUpdateDone') {
      this.callback$.next({ requestId: event.data.requestId });
    }
  }
  public sendMessage(data: any) {
    this.child.postMessage({
      type: "payload",
      requestId: this.requestId++,
      data: data
    }, "*");
  }
}
