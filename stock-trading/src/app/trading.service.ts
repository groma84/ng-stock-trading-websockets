import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class TradingService {
  private socket$: WebSocketSubject<any>;

  constructor() { }

  public init(socket: WebSocketSubject<any>) {
    this.socket$ = socket;
  }

  public disconnect() {
    this.socket$.complete();
  }

  get stockUpdates() {
    return this.socket$.asObservable();
  }

  buyStock(id: number, amount: number) {
    this.socket$.next(JSON.stringify({
        id: id,
        amount: amount,
        msgtype: 'BUY'
    }));
  }

  sellStock(id: number, amount: number) {
    this.socket$.next(JSON.stringify({
      id: id,
      amount: amount,
      msgtype: 'SELL'
    }));
  }
}
