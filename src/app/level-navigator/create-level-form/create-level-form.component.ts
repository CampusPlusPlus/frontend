import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogFormData {
  name: string;
}

@Component({
  selector: 'app-create-level-form',
  templateUrl: './create-level-form.component.html',
  styleUrls: ['./create-level-form.component.scss']
})
export class CreateLevelFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateLevelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogFormData
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('submit');
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close(this.data.name);
  }

}
