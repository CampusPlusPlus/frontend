import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagService } from '../../shared/services/tag.service';
import { Tag } from '../../shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @Input() tags: string[];
  tagNames: string[] = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: Tag[] = [];

  constructor(private tagService: TagService) {
    this.fetchTags();
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((userInput: string | null) => userInput ? this._filter(userInput) : this.tagNames.slice()));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.allTags.forEach(t => {
      if (this.tagNames.length < this.allTags.length) {
        this.tagNames.push(t.tagValue);
        console.log(t);
      }
    });
    return this.tagNames.filter(tag =>
      tag.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    if (this.allTags.map(x => x.tagValue).findIndex(x => x === value.toString()) === -1) {
      this.tagService.createTag$(value).subscribe();
    }
    this.tagCtrl.setValue(null);
    this.fetchTags();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    // this.tagService.getAllTags$().subscribe(
    //   response => {
    //     response.forEach(t => {
    //       if (t.tagValue === tag) {
    //         this.tagService.deleteTag(t.id);
    //       }
    //     });
    //   }
    // );

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fetchTags();
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private fetchTags(): void {
    this.allTags = this.tagService.getAllTags();
  }


}
