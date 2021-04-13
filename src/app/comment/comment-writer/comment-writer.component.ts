import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comment-writer',
  templateUrl: './comment-writer.component.html',
  styleUrls: ['./comment-writer.component.scss']
})
export class CommentWriterComponent implements OnInit {

  @Output() executeAction: EventEmitter<any> = new EventEmitter();
  text = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  sendComment(): void {
    this.executeAction.emit(this.text);
    this.text = '';
  }
}
