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
  uploadForm: FormGroup;
  lectures: Lecture[] = [];
  submit = false;
  tags: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private lectureService: LectureService,
    private curriculumService: CurriculumService,
    private tagService: TagService,
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: [],
      fileUploadLocations: [],
    });
  }

  ngOnInit(): void {
    this.lectures = this.lectureService.getLectures();
  }


  onSubmit(): void {
    try {
      this.upload();
    } catch (e) {
      console.log('upload error');
      return;
    }
  }

  private upload(): void {

    const formData = new FormData();
    const lectureName: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const lectureId: string = String(this.getLectureIdByName(lectureName));

    formData.append('lectureId', lectureId);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);

    forkJoin(
      {
        file: this.fileService.uploadFile$(formData),
        tag: this.tagService.getAllTags$()
      }
    ).subscribe(response => {
      // const fileID: SimpleFile = response.file.body.id;
      const temp: SimpleFile = response.file.body as SimpleFile;
      const fileID: number = temp.id;
      const tempTags: Tag[] = response.tag;
      tempTags.forEach(tempTag => this.tags.forEach(htmlTags => {
        if (htmlTags === tempTag.tagValue) {
          console.log(tempTag.tagValue);
          this.fileService.addTagToFile(fileID, tempTag.id);
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


}
