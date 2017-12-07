import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-stock-display',
  templateUrl: './stock-display.component.html',
  styleUrls: ['./stock-display.component.scss']
})
export class StockDisplayComponent implements OnInit {
  @Input() stockName;
  @Input() stockUpdate$: Observable<any>;
  @Input() trend$: Observable<number>;

  constructor() { }

  ngOnInit() {
  }

}
