import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  @Input() data: { rating: number };
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  upvote(): void {
    this.executeAction.emit(true);
  }

  downvote(): void {
    this.executeAction.emit(false);
  }
}
