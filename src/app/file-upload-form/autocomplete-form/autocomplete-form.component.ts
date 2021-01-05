import {
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import {DisciplineService} from '../../shared/services/discipline.service';
import {StudyCourseService} from '../../shared/services/study-course.service';
import {CurriculumService} from '../../shared/services/curriculum.service';
import {LectureService} from '../../shared/services/lecture.service';
import {TagService} from '../../shared/services/tag.service';
import {Discipline} from '../../shared/models/Discipline';
import {StudyCourse} from '../../shared/models/StudyCourse';
import {Curricula} from '../../shared/models/Curriculum';
import {Lecture} from '../../shared/models/Lecture';
import {Tag} from '../../shared/models/Tag';

export interface AutocompleteFormValues {
  discipline: string;
  studyCourses: string;
  curriculum: string;
  lectures: string;
  assignments: string;
}

@Component({
  selector: 'app-autocomplete-form',
  templateUrl: './autocomplete-form.component.html',
  styleUrls: ['./autocomplete-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutocompleteFormComponent),
      multi: true,
    },
  ],
})
export class AutocompleteFormComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @ViewChild('disciplineValue', {static: true})
  disciplineNameDOMElement: ElementRef;
  @ViewChild('studyCourseValue', {static: true})
  studyCourseDOMElement: ElementRef;
  @ViewChild('curriculaValue', {static: true})
  lectureDOMElement: ElementRef;
  form: FormGroup;
  subscriptions: Subscription[] = [];
  filteredDisciplines: Observable<string[]>;
  filteredStudyCourses: Observable<string[]>;
  filteredCurricular: Observable<string[]>;
  filteredLectures: Observable<string[]>;
  filteredTagTypes: Observable<string[]>;
  filteredTagNames: Observable<string[]>;
  disciplines: Discipline[] = [];
  disciplineNames: string[] = [];
  studyCourses: StudyCourse[] = [];
  studyCourseNames: string[] = [];
  curricula: Curricula[] = [];
  curriculaNames: string[] = [];
  lectures: Lecture[] = [];
  lectureNames: string[] = [];
  tags: Tag[] = [];
  tagTypes: string[] = [];
  tagNames: string[] = [];

  get value(): AutocompleteFormValues {
    return this.form.value;
  }

  set value(value: AutocompleteFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private formBuilder: FormBuilder,
    private disciplineService: DisciplineService,
    private studyCourseService: StudyCourseService,
    private curriculumService: CurriculumService,
    private lectureService: LectureService,
    private tagService: TagService
  ) {
    this.form = this.formBuilder.group({
      discipline: [],
      studyCourses: [],
      curriculum: [],
      lectures: [],
      // tagTypes: [],
      // tagNames: [],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.initDisciplines();
    // this.initTags();
  }

  private initDisciplines(): void {
    this.disciplines = this.disciplineService.getDisciplines();
  }

  autocompleteDisciplines(): void {
    this.filteredDisciplines = this.form.get('discipline').valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        if (!!value) {
          const id = this.disciplines.find(x => x.name.toLocaleLowerCase() === value.toLocaleLowerCase())?.id;
          if (!!id) {
            this.initStudyCourses(id);
          }
        }
        return this._disciplineFilter(value);
      }),
    );
  }

  private _disciplineFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.disciplines.forEach(d => {
      if (this.disciplineNames.length < this.disciplines.length) {
        this.disciplineNames.push(d.name);
      }
    });
    return this.disciplineNames.filter((discipline) =>
      discipline.toLowerCase().includes(filterValue)
    );
  }

  private initStudyCourses(id: number): void {
    if (this.studyCourseNames.length > 0) {
      this.form.get('studyCourses').reset();
      this.form.get('curriculum').reset();
      this.form.get('lectures').reset();
      this.studyCourseNames = [];
      this.curriculaNames = [];
      this.lectureNames = [];
    }
    this.studyCourses = this.disciplineService.getStudyCoursesByDisciplineID(id);
  }

  autocompleteStudyCourses(): void {
    this.filteredStudyCourses = this.form.get('studyCourses').valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (!!value) {
          const id = this.studyCourses.find(x => x.name.toLocaleLowerCase() === value.toLocaleLowerCase())?.id;
          if (!!id) {
            this.initCurricular(id);
          }
        }
        return this._studyCoursesFilter(value);
      })
    );
  }

  private _studyCoursesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.studyCourses.forEach(s => {
      if (this.studyCourseNames.length < this.studyCourses.length) {
        this.studyCourseNames.push(s.name);
      }
    });
    return this.studyCourseNames.filter((studyCourse) =>
      studyCourse.toLowerCase().includes(filterValue)
    );
  }

  private initCurricular(id: number): void {
    if (this.curriculaNames.length > 0) {
      this.form.get('curriculum').reset();
      this.form.get('lectures').reset();
      this.curriculaNames = [];
      this.lectureNames = [];
    }
    this.curricula = this.studyCourseService.getCurriculaByStudyCourse(id);
  }

  autocompleteCurricula(): void {
    this.filteredCurricular = this.form.get('curriculum').valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (!!value) {
          const id = this.curricula.find(x => x.name.toLocaleLowerCase() === value.toLocaleLowerCase())?.id;
          if (!!id) {
            this.initLectures(id);
          }
        }
        return this._curriculaFilter(value);
      })
    );
  }

  private _curriculaFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.curricula.forEach(c => {
      if (this.curriculaNames.length < this.curricula.length) {
        this.curriculaNames.push(c.name);
      }
    });
    return this.curriculaNames.filter((curricula) =>
      curricula.toLowerCase().includes(filterValue)
    );
  }

  private initLectures(id: number): void {
    this.lectureNames = [];
    this.lectures = this.curriculumService.getLecturesByCurriculaID(id);
  }

  autocompleteLectures(): void {
    this.filteredLectures = this.form.get('lectures').valueChanges.pipe(
      startWith(''),
      map((value) => this._lectureFilter(value))
    );
  }

  private _lectureFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.lectures.forEach(l => {
      if (this.lectureNames.length < this.lectures.length) {
        this.lectureNames.push(l.name);
      }
    });
    return this.lectureNames.filter((lecture) =>
      lecture.toLowerCase().includes(filterValue)
    );
  }

/*
  private initTags(): void {
    this.tags = this.tagService.getAllTags();
  }


  autocompleteTagTypes(): void {
    this.filteredTagTypes = this.form.get('tagTypes').valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (!!value) {
          const name = this.tagTypes.find(x => x.toLocaleLowerCase() === value.toLocaleLowerCase());
          if (!!name) {
            this.initTagNames(name);
          }
        }
        return this._tagTypeFilter(value);
      })
    );
  }

  private _tagTypeFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.tags.forEach(l => {
      this.tagTypes.indexOf(l.tagType) === -1 ? this.tagTypes.push(l.tagType) : console.log();
    });
    return this.tagTypes.filter((tagType) =>
      tagType.toLowerCase().includes(filterValue)
    );
  }

  private initTagNames(name): void {
    this.tagNames = [];
    this.form.get('tagNames').reset();
    this.tags.forEach(t => {
      if (t.tagType === name) {
        this.tagNames.push(t.tagValue);
      }
    });
  }

  autocompleteTagNames(): void {
    this.filteredTagNames = this.form.get('tagNames').valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._tagNameFilter(value);
      })
    );
  }


  private _tagNameFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagNames.filter((tagName) =>
      tagName.toLowerCase().includes(filterValue)
    );
  }
*/

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {
  };

  onTouched: any = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(value): void {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(_: FormControl): any {
    return this.form.valid ? null : {autocomplete: {valid: false}};
  }
}
