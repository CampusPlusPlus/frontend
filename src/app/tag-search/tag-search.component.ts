import { Component, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagService } from '../shared/services/tag.service';
import { Tag } from '../shared/models/Tag';
import { FileService } from '../shared/services/file.service';
import { FullFile } from '../shared/models/FullFile';

@Component({
  selector: 'app-tag-search',
  templateUrl: './tag-search.component.html',
  styleUrls: ['./tag-search.component.scss']
})
export class TagSearchComponent {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  selectedTags: string[] = [];
  allTags: Tag[] = [];
  allTags$: Observable<Tag[]>;
  foundFiles: FullFile[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private tagService: TagService, private fileService: FileService) {
    this.allTags$ = this.tagService.getAllTags$();
    this.allTags$.subscribe((tags) => {
      this.allTags.push(...tags.map((tag) => tag));
    });
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTags.map((tag) => tag.tagValue).slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const candidate = this.allTags.find((tag) => tag.tagValue === value);
    if (candidate) {
      this.selectedTags.push(value);
    }

    if (input) {
      input.value = '';
    }

    this.searchFiles();
  }

  remove(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
    this.searchFiles();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.searchFiles();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.map((tag) => tag.tagValue).filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  searchFiles(): void {
    const tagIDArr = this.selectedTags.map((tag) => this.allTags.find((t) => t.tagValue === tag).id);
    this.fileService.getFilesByTagIDs$(tagIDArr).subscribe((res) => {
      this.foundFiles = res;
    });
  }

}
