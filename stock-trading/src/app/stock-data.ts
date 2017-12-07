import {Observable} from 'rxjs/Observable';

export class StockData {
  name: string;
  id: number;
  history: Observable<number[]>;
  updates: Observable<any>;
  trend: Observable<number>;

  constructor(name: string,
              id: number,
              history: Observable<number[]>,
              updates: Observable<any>,
              trend: Observable<number>) {
    this.name = name;
    this.id = id;
    this.history = history;
    this.updates = updates;
    this.trend = trend;
  }
}
