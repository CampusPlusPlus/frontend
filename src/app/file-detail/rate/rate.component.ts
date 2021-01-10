import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullFile } from '../../shared/models/FullFile';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  @Input() data: FullFile;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
  }

  upvote(): void {
    this.executeAction.emit(true);
  }

  downvote(): void {
    this.executeAction.emit(false);
  }

  voted(): 0 | 1 | 2 {
    if (this.data && this.data.upvotes.find((x) => x === this.auth.token.sub)) {
      return 1;
    }
    if (this.data && this.data.downvotes.find((x) => x === this.auth.token.sub)) {
      return 2;
    }
    return 0;
  }

}
