import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-level-lecture-form',
  templateUrl: './create-level-lecture-form.component.html',
  styleUrls: ['./create-level-lecture-form.component.scss']
})
export class CreateLevelLectureFormComponent implements OnInit {

  name: string;
  relativeSemester: number;

  constructor(
    public dialogRef: MatDialogRef<CreateLevelLectureFormComponent>
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('submit');
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close({ name: this.name, relativeSemester: this.relativeSemester });
  }

}
