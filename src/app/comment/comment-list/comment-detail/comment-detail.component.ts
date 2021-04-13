import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../shared/models/Comment';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit {

  @Input() data: Comment;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
  }

  isAuthorized(): boolean {
    return this.auth.isModOrAdmin || this.auth.ownsFile(this.data.authorId);
  }
}
