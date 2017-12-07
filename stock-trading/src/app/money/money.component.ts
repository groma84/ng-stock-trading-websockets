import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit {
  @Input() money;

  constructor() { }

  ngOnInit() {
  }
}
