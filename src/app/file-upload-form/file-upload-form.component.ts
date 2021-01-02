import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileService} from '../shared/services/file.service';

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
    private formBuilder: FormBuilder,
    private fileService: FileService
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
    this.upload();
    this.submit = true;
  }

  private upload(): void {
    const formData = new FormData();
    formData.append('lectureId', '24');
    formData.append('file', this.uploadForm.get('uploads').value.file);
    console.log(this.uploadForm.get('uploads'));
    this.fileService.uploadFile(formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }
}
