import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-stock-trade',
  templateUrl: './stock-trade.component.html',
  styleUrls: ['./stock-trade.component.scss']
})
export class StockTradeComponent implements OnInit {
  @Output() buyClicked = new EventEmitter<number>();
  @Output() sellClicked = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  buy(amount: number) {
    this.buyClicked.emit(amount);
  }

  sell(amount: number) {
    this.sellClicked.emit(amount);
  }
}
