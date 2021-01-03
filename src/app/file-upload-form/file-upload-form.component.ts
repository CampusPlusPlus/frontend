import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileService} from '../shared/services/file.service';
import {DisciplineService} from '../shared/services/discipline.service';
import {LectureService} from '../shared/services/lecture.service';
import {TagService} from '../shared/services/tag.service';

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
    private fileService: FileService,
    private lectureService: LectureService,
    private tagService: TagService
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
    console.log(this.uploadForm);
    this.createTags();
    // this.upload();
    // this.submit = true;
  }

  private upload(): void {
    const formData = new FormData();
    const name: string = this.uploadForm.get('fileUploadLocations').value.lectures;
    const id: string = String(this.lectureService.getLectureId(name));
    console.log(id);
    formData.append('lectureId', id);
    formData.append('file', this.uploadForm.get('uploads').value.dummyFile);
    this.fileService.uploadFile(formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  createTags() {
    this.uploadForm.get('tags').value.tags.forEach(
      n => {
        const name: string = n.tagName;
        const type: string = n.tagType;
        this.tagService.createTag(name, type);
      }
    );
  }

  onReset(): void {
    console.log('reset');
    this.uploadForm.reset();
  }
}