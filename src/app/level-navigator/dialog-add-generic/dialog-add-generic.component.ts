import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface DialogData {
  name: string;
  relativeSemester: number;
}

@Component({
  selector: 'app-dialog-add-generic',
  templateUrl: './dialog-add-generic.component.html',
  styleUrls: ['./dialog-add-generic.component.scss']
})
export class DialogAddGenericComponent implements OnInit {

  // TODO: maybe make it generic?
  constructor(
    public dialogRef: MatDialogRef<DialogAddGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
