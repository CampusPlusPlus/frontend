import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith, catchError} from 'rxjs/operators';
import {HttpEventType, HttpErrorResponse} from '@angular/common/http';
import {UploadService} from '../upload.service';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  files = [];
  uploadForm: FormGroup;
  submit = false;
  options = ['disciplines', 'study courses', 'semester', 'assignment'];
  disciplines = ['discipline_1', 'discipline_2', 'discipline_3', 'discipline_4', 'discipline_5'];
  studyCourses = ['courses_1', 'courses_2', 'courses_3', 'courses_4'];
  semesters = ['semester 1', 'semester 2', 'semester 4', 'semester 4', 'semester 5', 'semester 6'];
  assignments = ['ue1', 'ue2'];
  filteredOptions: Observable<string[]>;

  constructor(private uploadService: UploadService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.autocompleteFilter();
  }

  initForm(): void {
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
        tags: new FormArray([], [Validators.required]),
      }),
    });
  }

  autocompleteFilter(): void {
    this.filteredOptions = this.uploadForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    console.log(this.uploadForm);
    this.submit = true;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }

  onAddTag(): void {
    const control = new FormControl(null, Validators.required);
    (this.uploadForm.get('fileAllData.tags') as FormArray).push(control);
  }

  getControls(): AbstractControl[] {
    return (this.uploadForm.get('fileAllData.tags') as FormArray).controls;
  }

  uploadFile(file): void {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed`);
      })
    ).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        console.log(event.body);
      }
    });
  }

  private uploadFiles(): void {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  onClick(): void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({data: file, inProgress: false, progress: 0});
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }
}
