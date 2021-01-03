import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DisciplineService } from '../shared/services/discipline.service';
import { StudyCourseService } from '../shared/services/study-course.service';
import { CurriculumService } from '../shared/services/curriculum.service';
import { LectureService } from '../shared/services/lecture.service';

@Component({
  selector: 'app-level-navigator',
  templateUrl: 'level-navigator.component.html',
  styleUrls: ['./level-navigator.component.scss']
})
export class LevelNavigatorComponent implements OnInit {

  data: any[] = [];
  id = -1;
  title = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private disciplineService: DisciplineService,
    private studyCourseService: StudyCourseService,
    private curriculumService: CurriculumService,
    private lectureService: LectureService
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
        this.emptyArray();
        this.data = this.disciplineService.getDisciplines();
        break;
      case 2:
        this.id = Number(this.route.snapshot.url[1].path);
        this.title = 'StudyCourse';
        this.emptyArray();
        this.data = this.studyCourseService.getStudyCourseByDisciplineID(this.id);
        break;
      case 3:
        this.id = Number(this.route.snapshot.url[2].path);
        this.title = 'Curriculum';
        this.data = this.curriculumService.getCurriculaByStudyCourse(this.id);
        break;
      case 4:
        this.id = Number(this.route.snapshot.url[3].path);
        this.title = 'Lecture';
        this.data = this.lectureService.getLecturesByCurriculaID(this.id);
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
