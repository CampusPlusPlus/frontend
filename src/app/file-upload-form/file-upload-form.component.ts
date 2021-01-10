import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FileService } from '../shared/services/file.service';
import { LectureService } from '../shared/services/lecture.service';
import { TagService } from '../shared/services/tag.service';
import { Lecture } from '../shared/models/Lecture';
import { forkJoin, Subject } from 'rxjs';
import { Tag } from '../shared/models/Tag';
import { SimpleFile } from '../shared/models/SimpleFile';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorService } from '../shared/services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth.service';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
})
export class FileUploadFormComponent implements OnInit {
  uploadForm: FormGroup;
  @ViewChild('f') tagForm: NgForm;
  lectures: Lecture[] = [];
  submit = false;
  tags: string[] = [];
  immediatelyTagFile = false;
  @Input() disciplineNames: string[] = [];
  @Input() studyCourseNames: string[] = [];
  @Input() curriculaNames: string[] = [];
  @Input() lectureNames: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private lectureService: LectureService,
    private tagService: TagService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.uploadForm = this.formBuilder.group({
      uploads: ['', Validators.required],
      fileUploadLocations: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.lectures = this.lectureService.getLectures();
  }


  onSubmit(): void {
    console.log('swagging');
    const formData = new FormData();
    const lectureName: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const lectureId: string = String(this.getLectureIdByName(lectureName));

    formData.append('lectureId', lectureId);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);

    this.tags = this.tags.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    const notExistingTags: string[] = [];
    this.tagService.getAllTags$().pipe(
      map((arr) => {
        return (arr.map((elem) => elem.tagValue)) as string[];
      }),
      map((strArr) => strArr.filter((elem) => this.tags.indexOf(elem) !== -1))
    ).subscribe((x) => {
      notExistingTags.push(...this.tags.filter((elem) => !x.includes(elem)));
      Promise.all(this.tagService.createTags(notExistingTags)).then((p: HttpResponse<any>[]) => {
        // let ttags = p.map((http) => http.body) as Tag[];


        forkJoin(
          {
            file: this.fileService.uploadFile$(formData),
            tag: this.tagService.getAllTags$()
          }
        ).subscribe(response => {
          const file: SimpleFile = response.file.body as SimpleFile;
          const tempTags: Tag[] = response.tag;
          console.log('tmpTags', tempTags);
          this.immediatelyTagFile = true;
          this.tags.forEach(textTag => {
            const tmp = tempTags.find(value => textTag === value.tagValue);
            if (!tmp) {
              this.tagService.getAllTags$().subscribe((ttags) => {
                const normalTag = ttags.find(k1 => k1.tagValue.toLowerCase() === textTag.toLowerCase());
                if (normalTag) {
                  console.log('ohh boi');
                  this.fileService.addTagToFile(file, normalTag.id);
                }
              });
            } else {
              this.fileService.addTagToFile(file, tmp.id);
            }
          });
          this.immediatelyTagFile = false;
          this.snackBar.open('The upload was a success', 'Close', {
            duration: 3000
          });
          window.history.back();
        }, (error: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(error);
        });
      });
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
    this.disciplineNames = [];
    this.studyCourseNames = [];
    this.curriculaNames = [];
    this.lectureNames = [];
    this.tags = [];
    this.uploadForm.reset();
  }
}
