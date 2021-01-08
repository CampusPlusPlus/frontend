import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimpleFile } from '../../shared/models/SimpleFile';
import { DialogConfirmationComponent } from '../../level-navigator/dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-file-element',
  templateUrl: './file-element.component.html',
  styleUrls: ['./file-element.component.scss']
})
export class FileElementComponent implements OnInit {

  @Input() data: SimpleFile;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  download(id: number): void {
    window.open(`http://localhost:9000/files/${id}/download`, '_blank');
  }

  delete(id: number): void {
    this.dialog.open(DialogConfirmationComponent, {
      data: {
        name: this.data.name,
        action: 'delete',
        type: 'file',
        confirmed: false
      }
    }).afterClosed().subscribe(x => {
      if (x) {
        this.executeAction.emit(id);
      }
    });
  }
}
