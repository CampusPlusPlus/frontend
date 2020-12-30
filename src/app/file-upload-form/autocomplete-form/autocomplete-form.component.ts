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
import {RestService} from '../../shared/services/rest.service';

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
  studyCourses: string[] = [];

  get value(): AutocompleteFormValues {
    return this.form.value;
  }

  log() {
    console.log(this.disciplineName.nativeElement.value);
  }

  set value(value: AutocompleteFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private formBuilder: FormBuilder,
    private restService: RestService
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
    this.restService.getDisciplines();
  }

  autocompleteDisciplines() {
    this.disciplines = this.restService.getDisciplineName();
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

  initStudyCourses(): string[] {
    const name = this.disciplineName.nativeElement.value;
    const id = this.restService.getDisciplineID(name);
    console.log(id);
    this.restService.getStudyCourseByDisciplineID(id);
    console.log(this.studyCourses);
    return this.studyCourses;
  }

   autocompleteStudyCourses() {
  // this.filteredDisciplines = this.form.get('studyCourses').valueChanges.pipe(
  //   startWith(''),
  //   map((value) => this._studyCoursesFilter(value))
  // );
   }

  // private _studyCoursesFilter(value: string): string[] {
  // const filterValue = value.toLowerCase();
  // const studyCourses: string[] = this.restService.getStudyCourseByDisciplineID(
  //   this.restService.getDisciplineIDByName(this.disciplineName.nativeElement.value));
  // return studyCourses.filter((discipline) =>
  //   discipline.toLowerCase().includes(filterValue)
  // );
  // }

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
