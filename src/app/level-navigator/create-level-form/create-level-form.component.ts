import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-level-form',
  templateUrl: './create-level-form.component.html',
  styleUrls: ['./create-level-form.component.scss']
})
export class CreateLevelFormComponent implements OnInit {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<CreateLevelFormComponent>
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('submit');
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close(this.name);
  }

}
