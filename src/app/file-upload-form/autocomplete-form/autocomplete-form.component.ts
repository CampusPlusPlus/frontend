import {
  Component,
  ElementRef,
  forwardRef, Input,
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
import {map, startWith} from 'rxjs/operators';
import {DisciplineService} from '../../shared/services/discipline.service';
import {StudyCourseService} from '../../shared/services/study-course.service';
import {CurriculumService} from '../../shared/services/curriculum.service';
import {Discipline} from '../../shared/models/Discipline';
import {StudyCourse} from '../../shared/models/StudyCourse';
import {Curricula} from '../../shared/models/Curriculum';
import {Lecture} from '../../shared/models/Lecture';

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
  disciplines: Discipline[] = [];
  @Input() disciplineNames: string[] = [];
  studyCourses: StudyCourse[] = [];
  @Input() studyCourseNames: string[] = [];
  curricula: Curricula[] = [];
  @Input() curriculaNames: string[] = [];
  lectures: Lecture[] = [];
  @Input() lectureNames: string[] = [];

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
  ) {
    this.form = this.formBuilder.group({
      discipline: [],
      studyCourses: [],
      curriculum: [],
      lectures: [],
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
    this.disciplineNames = [...this.disciplines.map((discipline) => discipline.name)];
    return this.disciplineNames.filter((discipline) => discipline.toLowerCase().includes(value?.toLowerCase()));
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
    this.studyCourseNames = [...this.studyCourses.map((studyCourse) => studyCourse.name)];
    return this.studyCourseNames.filter((studyCourse) => studyCourse.toLowerCase().includes(value?.toLowerCase()));
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
    this.curriculaNames = [...this.curricula.map((curriculum) => curriculum.name)];
    return this.curriculaNames.filter((curricula) => curricula.toLowerCase().includes(value?.toLowerCase()));
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
    this.lectureNames = [...this.lectures.map((lecture) => lecture.name)];
    return this.lectureNames.filter((lecture) => lecture.toLowerCase().includes(value?.toLowerCase()));
  }


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
