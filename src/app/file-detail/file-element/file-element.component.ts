import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullFile } from '../../shared/models/FullFile';
import { DialogConfirmationComponent } from '../../level-navigator/dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-file-element',
  templateUrl: './file-element.component.html',
  styleUrls: ['./file-element.component.scss']
})
export class FileElementComponent implements OnInit {

  @Input() data: FullFile;
  @Output() executeAction: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private auth: AuthService
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

  isModOrAdmin() {
    return this.auth ? this.auth.isModOrAdmin : false;
  }
}
