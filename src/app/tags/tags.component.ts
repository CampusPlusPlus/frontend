import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagService } from '../shared/services/tag.service';
import { Tag } from '../shared/models/Tag';
import { FileService } from '../shared/services/file.service';
import { FullFile } from '../shared/models/FullFile';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @Input() tags: string[];
  @Input() fullFile: FullFile;
  @Input() create: boolean;
  tagNames: string[] = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: Tag[] = [];
  readonly = false;
  tagId: number;
  userInput = [];


  constructor(private tagService: TagService,
              private fileService: FileService,
              private auth: AuthService,
              private router: Router) {
    this.fetchTags();
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((userInput: string | null) => userInput ? this._filter(userInput) : this.tagNames.slice()));
  }

  isAuthorized(fullFile: FullFile): boolean {
    if (this.router.url === '/upload') {
      this.readonly = false;
      return true;
    } else if (this.auth.isModOrAdmin || !!fullFile && this.auth.ownsFile(this.fullFile.authorId)) {
      this.readonly = false;
      return true;
    } else {
      this.readonly = true;
      return false;
    }
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

  onClick(value): void {
    this.tagAlreadyExists(value);
  }

  private tagAlreadyExists(value: string): boolean {
    let retVal = false;
    this.tagService.getAllTags$().subscribe((ttags) => {
      const normalTag = ttags.find(x => x.tagValue.toLowerCase() === value.toLowerCase());
      if (normalTag && this.create) {
        this.fileService.addTagToFile(this.fullFile, normalTag.id);
        retVal = true;
      }
    });
    return retVal;
  }

  private createTagEvent(value): void {
    this.tagService.createTag$(value).subscribe(
      response => {
        this.tagId = response.body.id;
        if (this.create) {
          this.fileService.addTagToFile(this.fullFile, this.tagId);
        }
        this.fetchTags();
        return;
      }
    );
  }

  add(event: MatChipInputEvent): void {
    // this.fileService.addTagToFile(this.fullFile.id, 1);
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

    const temp = this.tagAlreadyExists(value);
    console.log(temp);
    if (!temp) {
      console.log('its happening');
      if (this.fullFile) {
        this.createTagEvent(value);
      } else {
        console.log('no file yet');
      }
    }

    this.tagCtrl.setValue(null);
    this.fetchTags();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    try {
      console.log('inside remove');
      this.tagService.getAllTags$().subscribe(
        response => {
          response.forEach(t => {
            if (t.tagValue === tag) {
              delete this.tags[this.tags.indexOf(tag)];
              this.fileService.removeTagFromFile$(this.fullFile, t.id).subscribe();
            }
          });
        }
      );
    } catch (e) {
    }

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
