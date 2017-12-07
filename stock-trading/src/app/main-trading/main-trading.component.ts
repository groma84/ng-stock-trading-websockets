import {Component, OnInit, OnDestroy} from '@angular/core';
import {WebsocketsService} from '../websockets.service';
import {TradingService} from '../trading.service';
import {Observable} from 'rxjs/Observable';
import {bufferCount, bufferTime, filter, map, share} from 'rxjs/operators';
import {StockData} from '../stock-data';

@Component({
  selector: 'app-main-trading',
  templateUrl: './main-trading.component.html',
  styleUrls: ['./main-trading.component.scss']
})
export class MainTradingComponent implements OnInit, OnDestroy {
  private websocketsService: WebsocketsService;
  private tradingService: TradingService;

  private stockUpdate$: Observable<any>;
  private stocks: StockData[];

  constructor(websocketsService: WebsocketsService, tradingService: TradingService) {
    this.websocketsService = websocketsService;
    this.tradingService = tradingService;

  }

  ngOnInit() {
    this.tradingService.init(this.websocketsService.connect('ws://localhost:9091/'));

    const stockUpdate$ = this.tradingService.stockUpdates.pipe(share());
    this.stockUpdate$ = stockUpdate$;



    const stockUpdate1$ = stockUpdate$.pipe(
      map(a => ({ 'quote': a.stock1Quote, 'held': a.stock1Held, 'amount': a.stock1Amount })),
      share());
    const stockUpdate2$ = stockUpdate$.pipe(
      map(a => ({ 'quote': a.stock2Quote, 'held': a.stock2Held, 'amount': a.stock2Amount })),
      share());

    const partial1$ = this.createSecondsAverage(stockUpdate$, (a) => a.stock1Quote);
    const partial2$ = this.createSecondsAverage(stockUpdate$, (a) => a.stock2Quote);

    const trend1$ = this.createTrend(partial1$);
    const trend2$ = this.createTrend(partial2$);

    this.stocks = [new StockData(
      'Stock 1',
      1,
      this.createStockHistory(partial1$),
      stockUpdate1$,
      trend1$
    ),
      new StockData(
        'Stock 2',
        2,
        this.createStockHistory(partial2$),
        stockUpdate2$,
        trend2$
      )];
  }

  private createTrend(partial$: Observable<any>) {
    return partial$.pipe(
      bufferCount(2, 1),
      map(vals => Math.sign(vals[1] - vals[0]) )
    );
  }

  private createSecondsAverage(update$: Observable<any>, firstProjection: (input: any) => number) {
    return update$.pipe(
      map(firstProjection),
      bufferTime(1000),
      map(a => a.reduce((acc, val) => acc + val, 0) / a.length),
      filter(a => !isNaN(a)),
      share());
  }

  private createStockHistory(update$: Observable<any>) {
    return update$.pipe(
      bufferCount(30, 1),
      map(a => a.reverse()),
      share()
    );
  }

  ngOnDestroy() {
    this.tradingService.disconnect();
  }

  buy(id: number, amount: number) {
    this.tradingService.buyStock(id, amount);
  }

  sell(id: number, amount: number) {
    this.tradingService.sellStock(id, amount);
  }
}
