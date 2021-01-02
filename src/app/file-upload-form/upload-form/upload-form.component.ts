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
import {FileService} from '../../shared/services/file.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
  fileValue: File;

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
      file: [''],
      dummyFile: ['']
    });
    this.subscription.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onFileSelect(event): any {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('dummyFile').setValue(file);
      this.form.get('file').setValue(file.name);
      this.fileValue = file;
    }
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

}
