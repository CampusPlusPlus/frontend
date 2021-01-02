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
import {map, startWith} from 'rxjs/operators';
import {DisciplineService} from '../../shared/services/discipline.service';
import {StudyCourseService} from '../../shared/services/study-course.service';
import {CurriculumService} from '../../shared/services/curriculum.service';
import {LectureService} from '../../shared/services/lecture.service';
import {TagService} from '../../shared/services/tag.service';

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
  disciplines = [];
  disciplineNames = [];
  studyCourses = [];
  studyCourseNames = [];
  curricula = [];
  curriculaNames = [];
  lectures = [];
  lectureNames = [];
  tags = [];
  tagTypes = [];
  tagNames = [];

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
      tagTypes: [],
      tagNames: [],
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
    this.initTags();
  }

  private initDisciplines(): void {
    this.disciplines = this.disciplineService.getDisciplines();
  }

  autocompleteDisciplines(): void {
    this.filteredDisciplines = this.form.get('discipline').valueChanges.pipe(
      startWith(''),
      map((value) => {
        const id = this.disciplineService.getDisciplineID(value);
        this.disciplineNames.forEach(d => {
          if (value === d) {
            this.initStudyCourses(id);
          }
        });
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

  private initStudyCourses(id: number) {
    this.studyCourses = this.studyCourseService.getStudyCourseByDisciplineID(
      id
    );
    this.studyCourses.forEach((s) => this.studyCourseNames.push(s.name));
  }

  autocompleteStudyCourses() {
    this.filteredStudyCourses = this.form.get('studyCourses').valueChanges.pipe(
      startWith(''),
      map((value) => {
        const id = this.studyCourseService.getStudyCourseID(value);
        this.studyCourseNames.forEach(d => {
          if (value === d) {
            this.initCurricular(id);
          }
        });
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
    this.curricula = this.curriculumService.getCurriculaByStudyCourse(id);
  }

  autocompleteCurricula() {
    this.filteredCurricular = this.form.get('curriculum').valueChanges.pipe(
      startWith(''),
      map((value) => {
        const id = this.curriculumService.getCurriculaIDByName(value);
        this.curriculaNames.forEach(d => {
          if (value === d) {
            this.initLectures(id);
          }
        });
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
    this.lectures = this.lectureService.getLecturesByCurriculaID(id);
  }

  autocompleteLectures() {
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

  private initTags(): void {
    this.tags = this.tagService.getAllTags();
  }


  autocompleteTagTypes() {
    this.filteredTagTypes = this.form.get('tagTypes').valueChanges.pipe(
      startWith(''),
      map((value) => {
        console.log('a: ' + value);
        this.tagTypes.forEach(d => {
          console.log('b: ' + value);
        });
        return this._tagTypeFilter(value);
      })
    );
  }

  private _tagTypeFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let uniqueTagTypes;
    this.tags.forEach(l => {
      if (l.tagType !== this.tagTypes) {
        this.tagTypes.push(l.tagType);
        uniqueTagTypes = [...new Set(this.tagTypes)];
        this.tagTypes = [...uniqueTagTypes];
        console.log(this.tagTypes);
      }
    });
    return uniqueTagTypes.filter((tagType) =>
      tagType.toLowerCase().includes(filterValue)
    );
  }

  private getTagNamesFromType(tagType: string) {
    let uniqueTagNames;
    this.tags.forEach(t => {
      if (t.tagType === tagType) {
        this.tagNames.push(t.tagNames);
      }
      console.log(this.tagNames);
      uniqueTagNames = [...new Set(this.tagNames)];
      this.tagNames = [...uniqueTagNames];
    });
    console.log(this.tagNames);
    return this.tagNames;
  }


  autocompleteTagNames() {
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
