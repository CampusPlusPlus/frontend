import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FullFile } from '../shared/models/FullFile';
import { FileService } from '../shared/services/file.service';
import { Comment } from '../shared/models/Comment';
import {log} from "util";

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {

  id: number;
  data: FullFile;
  tags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.url.length === 6 ? Number(this.route.snapshot.url[5].path) : Number(this.route.snapshot.url[1].path);
    this.fetchFile();
  }

  private fetchFile(): void {
    this.fileService.getFileByID$(this.id).subscribe(value => {
      this.data = value;
      this.data.tags.forEach(x => this.tags.push(x.tagValue));
    }, (error => console.log(error)));
  }

  delete(): void {
    this.fileService.deleteFile(this.data).subscribe(() => {
      this.location.back();
    });
  }

  rate(id: number, vote: boolean): void {
    console.log('2', 'vote', id, vote);
    if (vote) {
      this.fileService.upvote(id).subscribe((res) => {
        this.fetchFile();
      });
    } else {
      this.fileService.downvote(id).subscribe((res) => {
        this.fetchFile();
      });
    }
  }

  deleteComment(comment: Comment): void {
    this.fileService.deleteComment(comment).subscribe((res) => {
      this.fetchFile();
    });
  }

  sendComment(text: string): void {
    console.log("i got text", text);
    this.fileService.addCommentToFileByID(this.id, text).subscribe((res) => {
      this.fetchFile();
    });
  }
}
