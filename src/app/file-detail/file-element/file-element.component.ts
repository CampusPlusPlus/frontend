import { Component, Input, OnInit } from '@angular/core';
import { SimpleFile } from '../../shared/models/SimpleFile';

@Component({
  selector: 'app-file-element',
  templateUrl: './file-element.component.html',
  styleUrls: ['./file-element.component.scss']
})
export class FileElementComponent implements OnInit {

  @Input() data: SimpleFile;

  constructor() {}

  ngOnInit(): void {}

  download(id: number): void {
    window.open(`http://localhost:9000/files/${id}/download`, '_blank');
  }
}
