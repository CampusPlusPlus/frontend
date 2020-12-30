import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormArray, FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {UploadService} from '../shared/services/upload.service';
import {
  map,
  startWith,
} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {RestService} from '../shared/services/rest.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
})
export class FileUploadFormComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  uploadForm: FormGroup;
  submit = false;
  disciplinesFromGet: string[] = [];

  constructor(
    private http: HttpClient,
    private uploadService: UploadService,
    private arrayService: RestService,
    private formBuilder: FormBuilder
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: [],
      fileUploadLocations: [],
      tags: [],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.uploadForm.value);
    this.submit = true;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }



}
