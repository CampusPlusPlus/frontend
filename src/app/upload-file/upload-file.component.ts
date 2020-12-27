import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadForm: FormGroup;

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
        addTagToFile: new FormControl(
          null
        ),
      })
    });
  }

  onSubmit(): void {
    console.log(this.uploadForm);
  }

  onReset(): void {
    this.uploadForm.reset();
  }

}
