import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogConfirmationData {
  confirmed: boolean;
  action: string;
  name: string;
}

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmationData) {
  }

  ngOnInit(): void {
  }

  confirm(b: boolean): void {
    this.data.confirmed = b;
    this.dialogRef.close();
  }
}
