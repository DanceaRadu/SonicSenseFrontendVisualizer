import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Stomp.Client | undefined;
  private socket: any;
  private messageSubject: Subject<any> = new Subject<any>();
  private connectionStatusSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.connect();
  }

  connect(): void {
    this.socket = new SockJS(environment.baseURL + '/ws');
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.debug = () => {};

    this.stompClient.connect({}, () => {
      this.connectionStatusSubject.next(true);
      this.stompClient!.subscribe('/topic/sound-events', (message: any) => {
        this.onMessageReceived(message);
      });
    }, (error: any) => {
      this.connectionStatusSubject.next(false);
      console.error('Error connecting to WebSocket:', error);
    });
  }

  private onMessageReceived(message: any): void {
    const messageBody = JSON.parse(message.body);
    this.messageSubject.next(messageBody);
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        this.connectionStatusSubject.next(false);
        console.log('Disconnected from WebSocket');
      });
    }
  }
}
