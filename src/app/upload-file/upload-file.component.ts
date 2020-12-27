import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadForm: FormGroup;
  submit = false;

  constructor() {
  }

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      fileAllData: new FormGroup({
        chooseUploadFile: new FormControl(
          null, [Validators.required]
        ),
        fileUploadLocationData: new FormGroup({
          uploadLocation: new FormControl(
            null, [Validators.required]
          ),
        }),
        tags: new FormArray([]),
      }),
    });
  }

  onSubmit(): void {
    console.log(this.uploadForm);
    this.submit = true;
  }

  onReset(): void {
    this.uploadForm.reset();
  }

  onAddTag(): void {
    const control = new FormControl(null, Validators.required);
    (this.uploadForm.get('fileAllData.tags') as FormArray).push(control);
  }

  getControls(): object {
    return (this.uploadForm.get('fileAllData.tags') as FormArray).controls;
  }

}
