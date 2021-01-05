import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FileService} from '../shared/services/file.service';
import {LectureService} from '../shared/services/lecture.service';
import {TagService} from '../shared/services/tag.service';
import {CurriculumService} from '../shared/services/curriculum.service';
import {Lecture} from '../shared/models/Lecture';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Tag} from '../shared/models/Tag';
import {map} from 'rxjs/operators';
import {SimpleFile} from '../shared/models/SimpleFile';
import {PageableResponse} from '../shared/models/PageableResponse';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
})
export class FileUploadFormComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  uploadForm: FormGroup;
  chip: FormGroup;
  lectures: Lecture[] = [];
  submit = false;
  tagName: string;
  tagType: string;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  tags: string[] = [];
  // backendTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  backendTags: Tag[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private lectureService: LectureService,
    private curriculumService: CurriculumService,
    private tagService: TagService,
    private http: HttpClient
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: [],
      fileUploadLocations: [],
      tags: [],
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagService.createTag$(value).subscribe();
    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }


  ngOnInit(): void {
    this.lectures = this.lectureService.getLectures();
    this.initTags();
    // this.filteredTags = this.tagCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
  }


  onSubmit(): void {
    try {
      this.upload();
    } catch (e) {
      console.log(e);
      console.log('upload error');
      return;
    }
    // this.addTags();
    // this.submit = true;
  }

  private upload(): void {
    this.initTags();

    const formData = new FormData();
    const lectureName: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const lectureId: string = String(this.getLectureIdByName(lectureName));

    formData.append('lectureId', lectureId);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);

    forkJoin(
      {
        file: this.http.post('http://localhost:9000/files',
          formData, {
            observe: 'response'
          }
        ),
        tag: this.http.get('http://localhost:9000/tags',
        ).pipe(
          map((responseData: PageableResponse<Tag>) => {
            return responseData.content;
          }))
      }
    ).subscribe(response => {
      // const fileID: SimpleFile = response.file.body.id;
      const temp: SimpleFile = response.file.body as SimpleFile;
      const fileID: number = temp.id;
      console.log('temp: ', fileID);
      console.log('response.tag: ', response);
      const tempTags: Tag[] = response.tag;
      tempTags.forEach(temptag => this.tags.forEach(htmlTags => {
        if (htmlTags === temptag.tagValue) {
          console.log('add tag to file');
          this.fileService.addTagToFile(fileID, temptag.id);
        }
      }));
    });
  }

  getLectureIdByName(name: string): number {
    let id: number;
    this.lectures
      .forEach(l => {
        if (l.name === name) {
          id = l.id;
        }
      });
    return id;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }

  private initTags(): void {
    this.backendTags = this.tagService.getAllTags();
  }

}
