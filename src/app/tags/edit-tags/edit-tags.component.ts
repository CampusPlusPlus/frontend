import {Component, OnInit} from '@angular/core';
import {TagService} from "../../shared/services/tag.service";
import {Tag} from "../../shared/models/Tag";

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {
  allTags: Tag[] = [];

  constructor(private tagService: TagService) {
  }

  ngOnInit(): void {
    this.fetchTags();
  }

  fetchTags(): void {
    this.allTags = this.tagService.getAllTags();
  }

}
