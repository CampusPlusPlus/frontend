import {Component, ElementRef, forwardRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {LectureService} from '../../shared/services/lecture.service';

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
  @ViewChild('disciplineValue', {static: true}) disciplineName: ElementRef;
  form: FormGroup;
  subscriptions: Subscription[] = [];
  filteredDisciplines: Observable<string[]>;
  filteredStudyCourses: Observable<string[]>;
  disciplines: string[] = [];
  studyCourses = [];
  studyCourseNames = [];

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
    private lectureService: LectureService
  ) {
    this.form = this.formBuilder.group({
      discipline: [],
      studyCourses: [],
      curriculum: [],
      lectures: [],
      assignments: [],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.disciplineService.getDisciplines();
  }

  autocompleteDisciplines() {
    this.disciplines = this.disciplineService.getDisciplineName();
    this.filteredDisciplines = this.form.get('discipline').valueChanges.pipe(
      startWith(''),
      map((value) => this._disciplineFilter(value))
    );
  }

  private _disciplineFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.disciplines.filter((discipline) =>
      discipline.toLowerCase().includes(filterValue)
    );
  }

  initStudyCourses() {
    const name = this.disciplineName.nativeElement.value;
    const id = this.disciplineService.getDisciplineID(name);
    this.studyCourses = this.disciplineService.getStudyCourseByDisciplineID(id);
    this.studyCourses.forEach(s => this.studyCourseNames.push(s.name));
  }

  autocompleteStudyCourses() {
    this.initStudyCourses();
    this.filteredStudyCourses = this.form.get('studyCourses').valueChanges.pipe(
      startWith(''),
      map((value) => this._studyCoursesFilter(value))
    );
  }

  private _studyCoursesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.studyCourseNames.filter((discipline) =>
      discipline.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {
  }

  onTouched: any = () => {
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.form.reset();
    }
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : {autocomplete: {valid: false}};
  }
}
