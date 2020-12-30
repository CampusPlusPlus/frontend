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


  // private initForm(): FormGroup {
  //   return (this.uploadForm = new FormGroup({
  //     fileAllData: new FormGroup({
  //       chooseUploadFile: new FormControl(null, [Validators.required]),
  //       fileUploadLocationData: new FormGroup({
  //         disciplines: new FormControl(null, [Validators.required]),
  //         studyCourses: new FormControl(null, [Validators.required]),
  //         curriculum: new FormControl(null, [Validators.required]),
  //         lectures: new FormControl(null, [Validators.required]),
  //         assignments: new FormControl(null, [Validators.required]),
  //       }),
  //       tags-form: new FormArray([], [Validators.required]),
  //     }),
  //   }));
  // }

  private getDisciplineNames() {
    this.arrayService.getDisciplines().subscribe((disciplines) => {
      for (let i = 0; i < disciplines.length; i++) {
        this.disciplinesFromGet[i] = disciplines[i].name;
      }
    });
  }


  onSubmit(): void {
    console.log(this.uploadForm.value);
    this.submit = true;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }

  onAddTag(): void {
    // const control = new FormControl(null, Validators.required);
    // (this.uploadForm.get('fileAllData.tags-form') as FormArray).push(control);
  }


}
