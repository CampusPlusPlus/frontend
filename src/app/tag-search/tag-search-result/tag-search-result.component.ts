import { Component, Input, OnInit } from '@angular/core';
import { SimpleFile } from '../../shared/models/SimpleFile';
import { FullFile } from '../../shared/models/FullFile';

@Component({
  selector: 'app-tag-search-result',
  templateUrl: './tag-search-result.component.html',
  styleUrls: ['./tag-search-result.component.scss']
})
export class TagSearchResultComponent implements OnInit {

  @Input() files: FullFile[];

  constructor() { }

  ngOnInit(): void {}

}
