import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, FormControl
} from '@angular/forms';
import {Subscription} from 'rxjs';

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
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutocompleteFormComponent),
      multi: true
    }
  ]
})
export class AutocompleteFormComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): AutocompleteFormValues {
    return this.form.value;
  }

  set value(value: AutocompleteFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      discipline: [],
      studyCourses: [],
      curriculum: [],
      lectures: [],
      assignments: []
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

  // private disciplineAutocomplete() {
  //   this.filteredOptions = this.uploadForm
  //     .get('fileAllData.fileUploadLocationData.disciplines')
  //     .valueChanges.pipe(
  //       startWith(''),
  //       map((value) => this._filter(value))
  //     );
  // }
  //
  // private _filter(value: string): string[] {
  //   console.log(value);
  //   const filterValue = value.toLowerCase();
  //
  //   return this.disciplinesFromGet.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }
  //

}
