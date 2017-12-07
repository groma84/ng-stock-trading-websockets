import { Injectable } from '@angular/core';
import {WebSocketSubject} from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class WebsocketsService {

  constructor() { }

  public connect(url): WebSocketSubject<any> {
    return new WebSocketSubject(url);
  }
}
