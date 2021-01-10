import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../shared/models/Comment';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../level-navigator/dialog-confirmation/dialog-confirmation.component';
import { FullFile } from '../shared/models/FullFile';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() data: FullFile;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();
  @Output() sendCommentAction: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  handleDelete(comment: Comment): void {
    this.dialog.open(DialogConfirmationComponent, {
      data: {
        name: comment.text,
        action: 'delete',
        type: 'a comment from ' + comment.authorName,
        confirmed: false
      }
    }).afterClosed().subscribe(x => {
      if (x) {
        this.executeAction.emit(comment);
      }
    });
  }

}
