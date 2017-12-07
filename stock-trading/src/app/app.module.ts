import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MainTradingComponent } from './main-trading/main-trading.component';
import {WebsocketsService} from './websockets.service';
import {TradingService} from './trading.service';
import { MoneyComponent } from './money/money.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { StockDisplayComponent } from './stock-display/stock-display.component';
import { StockTradeComponent } from './stock-trade/stock-trade.component';


@NgModule({
  declarations: [
    AppComponent,
    MainTradingComponent,
    MoneyComponent,
    StockHistoryComponent,
    StockDisplayComponent,
    StockTradeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WebsocketsService, TradingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
