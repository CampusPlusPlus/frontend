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
import {HttpClient} from '@angular/common/http';

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
  tagName: string;
  tagType: string;

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

  ngOnInit(): void {
    this.lectures = this.lectureService.getLectures();
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
    const formData = new FormData();
    const name: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const id: string = String(this.getLectureIdByName(name));
    formData.append('lectureId', id);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);
    if (this.uploadForm.get('tags').value !== null) {
      this.uploadForm.get('tags').value.tags.forEach(
        t => {
          if (t.tagType !== null || t.tagName !== null) {
            this.tagName = t.tagName;
            this.tagType = t.tagType;
          }
        });
    }
    forkJoin(
      {
        file: this.http.post('http://localhost:9000/files',
          formData, {
            observe: 'response'
          }
        ),
        tag: this.http.post('http://localhost:9000/tags', {
            'tagValue': this.tagName,
            'tagType': this.tagType,
          }, {
            observe: 'response'
          }
        )
      }
    ).subscribe(response => {
      console.log(response.file.headers.get('location'));
      console.log(response.tag.headers.get('location'));
    });
    // this.fileService.uploadFile$(formData).subscribe(
    //   res => {
    //     if (this.uploadForm.get('tags').value !== null) {
    //       this.uploadForm.get('tags').value.tags.forEach(
    //         t => {
    //           if (t.tagType !== null || t.tagName !== null) {
    //             const tagName: string = t.tagName;
    //             const tagType: string = t.tagType;
    //             this.tagService.createTag$(tagName, tagType)
    //               .subscribe(response => {
    //                 const tempTag: string = res.headers.get('location');
    //                 const lastIndex = tempTag.lastIndexOf('/');
    //                 const tagId = +tempTag.substring(lastIndex + 1);
    //                 this.fileService.addTagToFile$(0, tagId);
    //               });
    //           }
    //         });
    //     }
    //     const temp: string = res.headers.get('location');
    //     const n = temp.lastIndexOf('/');
    //     const fileId = temp.substring(n + 1);
    //   },
    //   err => console.log(err)
    // );
  }

  // createTags(): void {
  //   if (this.uploadForm.get('tags').value !== null) {
  //     this.uploadForm.get('tags').value.tags.forEach(
  //       n => {
  //         if (n.tagType !== null || n.tagName !== null) {
  //           const name: string = n.tagName;
  //           const type: string = n.tagType;
  //           this.tagService.createTag(name, type);
  //         }
  //       });
  //   }
  // }

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
