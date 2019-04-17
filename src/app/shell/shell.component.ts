import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowRefService } from '../window-ref.service';
import { environment } from '../../environments/environment';
import { ChildService } from '../child.service';
import { Subject } from 'rxjs';
import { tap, catchError, takeUntil } from 'rxjs/operators';

const PRELOAD_URL = "/assets/preload.html";
const INNER_APP_URL = environment.innerAppUrl;


@Component({
  selector: 'shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  url: string = PRELOAD_URL;
  messages: string[] = [];
  callbacks: string[] = [];
  invoked: boolean = false;
  activeChildRoute: string = "welcome";
  iframe: any = {
    height: 700,
    width: 400
  };

  unsubscribe$: Subject<null> = new Subject();
  constructor(private windowRefService: WindowRefService, private childService: ChildService) { }

  ngOnInit() {
    this.windowRefService.nativeWindow.addEventListener("message", this.childService.getMessageCallback(), false);
    this.childService.message$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((message: string) => {
        this.messages.push(message);
      })
    this.childService.callback$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((callback: any) => {
        if (callback && callback.requestId) {
          this.callbacks.push("onUpdateDone: " + callback.requestId);
        }
      })
  }

  invokeInnerApp() {
    this.url = INNER_APP_URL;
    this.invoked = true;
    this.activeChildRoute = "welcome";
  }
  quitInnerApp() {
    this.url = PRELOAD_URL;
    this.invoked = false;
  }
  updateChildRoute() {
    console.log("UPDATE CHILD ROUTE", this.activeChildRoute);
    this.childService.sendMessage({ view: this.activeChildRoute });
  }

  iframeLoaded() {
    console.log("IFRAME LOADED")
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
