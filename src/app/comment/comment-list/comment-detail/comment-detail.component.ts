import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../shared/models/Comment';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit {

  @Input() data: Comment;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
