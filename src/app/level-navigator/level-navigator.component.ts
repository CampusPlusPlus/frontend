import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DisciplineService } from '../shared/services/discipline.service';
import { StudyCourseService } from '../shared/services/study-course.service';
import { CurriculumService } from '../shared/services/curriculum.service';
import { LectureService } from '../shared/services/lecture.service';
import { FileService } from '../shared/services/file.service';
import { Lecture } from '../shared/models/Lecture';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateLevelFormComponent, DialogFormData } from './create-level-form/create-level-form.component';
import {
  CreateLevelLectureFormComponent,
  DialogLectureFormData
} from './create-level-lecture-form/create-level-lecture-form.component';
import {
  DialogConfirmationComponent,
  DialogConfirmationData
} from './dialog-confirmation/dialog-confirmation.component';
import { BasicDTO } from '../shared/models/BasicDTO';

@Component({
  selector: 'app-level-navigator',
  templateUrl: 'level-navigator.component.html',
  styleUrls: ['./level-navigator.component.scss']
})
export class LevelNavigatorComponent implements OnInit {

  data: any[] = [];
  id = -1;
  level = -1;
  title = '';
  actionToggle: 'delete' | 'edit' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private disciplineService: DisciplineService,
    private studyCourseService: StudyCourseService,
    private curriculumService: CurriculumService,
    private lectureService: LectureService,
    private fileService: FileService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.navigate();
  }

  private navigate(): void {
    const len = this.route.snapshot.url.length;

    switch (len) {
      case 1:
        this.title = 'Discipline';
        this.level = 1;
        this.emptyArray();
        this.data = this.disciplineService.getDisciplines();
        break;
      case 2:
        this.id = Number(this.route.snapshot.url[1].path);
        this.title = 'StudyCourse';
        this.level = 2;
        this.emptyArray();
        this.data = this.disciplineService.getStudyCoursesByDisciplineID(this.id);
        break;
      case 3:
        this.id = Number(this.route.snapshot.url[2].path);
        this.title = 'Curriculum';
        this.level = 3;
        this.data = this.studyCourseService.getCurriculaByStudyCourse(this.id);
        break;
      case 4:
        this.id = Number(this.route.snapshot.url[3].path);
        this.title = 'Lecture';
        this.level = 4;
        this.data = this.curriculumService.getLecturesByCurriculaIDGroupedByRelativeSemester(this.id);
        console.log(this.data);
        break;
      case 5:
        this.id = Number(this.route.snapshot.url[4].path);
        this.title = 'Files';
        this.level = 5;
        this.data = this.lectureService.getFilesByLectureID(this.id);
        console.log(this.data);
        break;
      default:
        break;
    }
  }

  private emptyArray(): void {
    const len = this.data.length;
    this.data.splice(0, length);
  }

  action(obj: BasicDTO): void {
    if (this.actionToggle === '') {
      this.router.navigateByUrl(this.location.path() + '/' + obj.id).then(r => this.navigate());
    } else if (this.actionToggle === 'delete') {
      this.dialog.open(DialogConfirmationComponent, {
        data: {
          name: obj.name,
          action: this.actionToggle,
          confirmed: false
        }
      }).afterClosed().subscribe(x => {
        if (x) {
          this.deleteAction(obj.id);
        }
        this.actionToggle = '';
      });
    } else {
      const form = this.level === 4 ? CreateLevelLectureFormComponent : CreateLevelFormComponent;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '60%';
      dialogConfig.data = this.level === 4 ? {
        name: obj.name,
        id: obj.id,
        relativeSemester: obj.relativeSemester
      } as DialogLectureFormData : {
        name: obj.name,
        id: obj.id,
      } as DialogFormData;
      this.dialog.open(form, dialogConfig).afterClosed().subscribe(x => {
        if ((x && x.length > 0) || (x && x.name && x.relativeSemester)) {
          switch (this.level) {
            case 1:
              this.disciplineService.updateDisciplineByID(obj.id, { name: x }).subscribe({
                next: _ => this.data = this.disciplineService.getDisciplines(),
              });
              break;
            case 2:
              this.studyCourseService.updateStudyCourseByID(obj.id, { name: x, disciplineId: this.id }).subscribe({
                next: _ => this.data = this.disciplineService.getStudyCoursesByDisciplineID(this.id),
              });
              break;
            case 3:
              this.curriculumService.updateCurriculumByID(obj.id, { name: x, studyCourseId: this.id }).subscribe({
                next: _ => this.data = this.studyCourseService.getCurriculaByStudyCourse(this.id),
              });
              break;
            case 4:
              this.lectureService.updateLectureByID(obj.id, {
                name: x.name,
                relativeSemester: x.relativeSemester,
                curriculumId: this.id
              }).subscribe({
                next: _ => this.data = this.curriculumService.getLecturesByCurriculaIDGroupedByRelativeSemester(this.id),
              });
              break;
            default:
              console.log('ERR: unknown error');
              break;
          }
        }
        this.actionToggle = '';
      }, error => {
        console.log('ERR:', error);
      });
    }
  }

  openCreationDialog(): void {
    const form = this.level === 4 ? CreateLevelLectureFormComponent : CreateLevelFormComponent;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    this.dialog.open(form, dialogConfig).afterClosed().subscribe(x => {
      if ((x && x.length > 0) || (x && x.name && x.relativeSemester)) {
        switch (this.level) {
          case 1:
            this.disciplineService.createDiscipline({ name: x }).subscribe({
              next: _ => this.data = this.disciplineService.getDisciplines(),
            });
            break;
          case 2:
            this.studyCourseService.createStudyCourse({ name: x, disciplineId: this.id }).subscribe({
              next: _ => this.data = this.disciplineService.getStudyCoursesByDisciplineID(this.id),
            });
            break;
          case 3:
            this.curriculumService.createCurriculum({ name: x, studyCourseId: this.id }).subscribe({
              next: _ => this.data = this.studyCourseService.getCurriculaByStudyCourse(this.id),
            });
            break;
          case 4:
            this.lectureService.createLecture({
              name: x.name,
              relativeSemester: x.relativeSemester,
              curriculumId: this.id
            }).subscribe({
              next: _ => this.data = this.curriculumService.getLecturesByCurriculaIDGroupedByRelativeSemester(this.id),
            });
            break;
          default:
            console.log('ERR: unknown error');
            break;
        }
      }
    }, error => {
      console.log('ERR:', error);
    });
  }

  deleteAction(id: number): void {
    switch (this.level) {
      case 1:
        this.disciplineService.deleteDiscipline(id).subscribe({
          next: _ => this.data = this.disciplineService.getDisciplines(),
        });
        break;
      case 2:
        this.studyCourseService.deleteStudyCourse(id).subscribe({
          next: _ => this.data = this.disciplineService.getStudyCoursesByDisciplineID(this.id),
        });
        break;
      case 3:
        this.curriculumService.deleteCurriculum(id).subscribe({
          next: _ => this.data = this.studyCourseService.getCurriculaByStudyCourse(this.id),
        });
        break;
      case 4:
        this.lectureService.deleteLecture(id).subscribe({
          next: _ => this.data = this.curriculumService.getLecturesByCurriculaIDGroupedByRelativeSemester(this.id),
        });
        break;
      default:
        console.log('ERR: unknown error');
        break;
    }
  }

  setDelete(): void {
    this.actionToggle = this.actionToggle === 'delete' ? '' : 'delete';
  }

  setEdit(): void {
    this.actionToggle = this.actionToggle === 'edit' ? '' : 'edit';
  }
}
