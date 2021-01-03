import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileService} from '../shared/services/file.service';
import {DisciplineService} from '../shared/services/discipline.service';
import {LectureService} from '../shared/services/lecture.service';
import {TagService} from '../shared/services/tag.service';
import {CurriculumService} from '../shared/services/curriculum.service';
import {Lecture} from '../shared/models/Lecture';
import {forkJoin, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SimpleFile} from '../shared/models/SimpleFile';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
})
export class FileUploadFormComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  uploadForm: FormGroup;
  lectures: Lecture[] = [];
  submit = false;

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private lectureService: LectureService,
    private curriculumService: CurriculumService,
    private tagService: TagService
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: [],
      fileUploadLocations: [],
      tags: [],
    });
  }

  ngOnInit(): void {
    this.lectures = this.lectureService.getLectures();
  }

  onSubmit(): void {
    // this.createTags();
    // this.upload();
    this.getIdOfUploadedFile();
    // this.addTags();
    // this.submit = true;
  }

  private upload(): void {
    const formData = new FormData();
    const name: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const id: string = String(this.getLectureIdByName(name));
    formData.append('lectureId', id);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);
    this.fileService.uploadFile(formData);
  }

  createTags(): void {
    if (this.uploadForm.get('tags').value !== null) {
      this.uploadForm.get('tags').value.tags.forEach(
        n => {
          if (n.tagType !== null || n.tagName !== null) {
            const name: string = n.tagName;
            const type: string = n.tagType;
            this.tagService.createTag(name, type);
          }
        });
    }
  }

  getLectureIdByName(name: string): number {
    let id: number;
    this.lectures
      .forEach(l => {
        if (l.name === name) {
          id = l.id;
          console.log('a', id);
        }
      });
    return id;
  }

  getIdOfUploadedFile(): number {
    let id = 0;
    if (this.uploadForm.get('uploads').value !== null) {
      const name = this.uploadForm.get('uploads').value.dummyFile.name;
    }
    return id;
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }
}
