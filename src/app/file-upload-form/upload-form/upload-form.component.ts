import {Component, ElementRef, forwardRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FileService} from "../../shared/services/file.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export interface UploadFormValues {
  file: string;
}

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UploadFormComponent),
      multi: true
    }
  ]
})
export class UploadFormComponent implements OnDestroy, ControlValueAccessor {
  form: FormGroup;
  subscription: Subscription[] = [];
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  files = [];

  get value(): UploadFormValues {
    return this.form.value;
  }

  set value(value: UploadFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private fileService: FileService) {
    this.form = this.formBuilder.group({
      file: [],
    });
    this.subscription.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onClick() {
    console.log(this.form.get('file').value);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {
  }
  onTouched: any = () => {
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  writeValue(value): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  validate(_: FormControl): any {
    return this.form.valid ? null : {upload: {valid: false}};
  }

  /*
  uploadFile(file): void {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload-form(formData).pipe(
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
        return of(`${file.data.name} upload-form failed`);
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
*/
}
