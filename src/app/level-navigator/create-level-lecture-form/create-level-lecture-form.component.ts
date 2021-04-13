import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogLectureFormData {
  name: string;
  relativeSemester: 1 | 2 | 3 | 4 | 5 | 6;
}

@Component({
  selector: 'app-create-level-lecture-form',
  templateUrl: './create-level-lecture-form.component.html',
  styleUrls: ['./create-level-lecture-form.component.scss']
})
export class CreateLevelLectureFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateLevelLectureFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogLectureFormData
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close(this.data);
  }

}
