import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, Validators
} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface TagsFormValues {
  tags: string[];
}

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TagsFormComponent),
      multi: true
    }
  ]
})
export class TagsFormComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): TagsFormValues {
    return this.form.value;
  }

  set value(value: TagsFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
        tags: this.formBuilder.array([]) // this.formBuilder.array([this.createTag()])
      }
    );
    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  newTag(): FormGroup {
    return this.formBuilder.group({
      tagType: null,
      tagName: null
    });
  }

  onAddTag(): void {
    this.tags().push(this.newTag());
  }

  onRemoveTag(index: number) {
    this.tags().removeAt(index);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {
  }
  onTouched: any = () => {
  }

  registerOnChange(fn) {
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

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : {tags: {valid: false}};
  }

  // onAddTag(): void {
  //   const control = new FormControl(null, Validators.required);
  //   (this.form.get('tags') as FormArray).push(control);
  //   // (this.uploadForm.get('fileAllData.tags-form') as FormArray).push(control);
  // }
  //
  //
  // getControls() {
  //   return (this.form.get('tags') as FormArray).controls;
  // }

}
