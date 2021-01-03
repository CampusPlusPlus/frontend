import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { SimpleFile } from "../shared/models/SimpleFile";
import { FileService } from "../shared/services/file.service";

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {

  id: number;
  data: SimpleFile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.url[5].path);
    this.fileService.getFileByID$(this.id).subscribe(value => this.data = value);
  }

}
