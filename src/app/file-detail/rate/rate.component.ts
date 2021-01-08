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
    console.log("1", "upvote");
    this.executeAction.emit(true);
  }

  downvote(): void {
    console.log("1", "downvote");
    this.executeAction.emit(false);
  }
}
