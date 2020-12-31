import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from '../shared/services/upload.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
})
export class FileUploadFormComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  uploadForm: FormGroup;
  submit = false;
  disciplinesFromGet: string[] = [];

  constructor(
    private http: HttpClient,
    private uploadService: UploadService,
    private formBuilder: FormBuilder
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: [],
      fileUploadLocations: [],
      tags: [],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.uploadForm.value);
    this.submit = true;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }
}
