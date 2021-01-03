import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DisciplineService } from '../shared/services/discipline.service';
import { StudyCourseService } from '../shared/services/study-course.service';
import { CurriculumService } from '../shared/services/curriculum.service';
import { LectureService } from '../shared/services/lecture.service';
import { FileService } from '../shared/services/file.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private disciplineService: DisciplineService,
    private studyCourseService: StudyCourseService,
    private curriculumService: CurriculumService,
    private lectureService: LectureService,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    this.navigate();
  }

  private navigate(): void {
    const len = this.route.snapshot.url.length;

    switch (len) {
      case 1:
        this.title = 'discipline';
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
        this.data = this.curriculumService.getLecturesByCurriculaID(this.id);
        break;
      case 5:
        this.id = Number(this.route.snapshot.url[4].path);
        this.title = 'Files';
        this.level = 5;
        break;
      default:
        break;
    }
  }

  private emptyArray(): void {
    const len = this.data.length;
    this.data.splice(0, length);
  }

  backButton(): void {
    this.location.back();
  }

  loadData(id): void {
    this.router.navigateByUrl(this.location.path() + '/' + id);
    this.navigate();
  }
}
