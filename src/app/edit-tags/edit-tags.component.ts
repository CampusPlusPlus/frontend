import { Component, OnInit } from '@angular/core';
import { TagService } from '../shared/services/tag.service';
import { Tag } from '../shared/models/Tag';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ErrorService } from '../shared/services/error.service';
import { AuthService } from '../shared/services/auth.service';

export interface DialogData {
  tagName: string;
}

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {
  allTags: Tag[] = [];
  tagName: string;

  constructor(private tagService: TagService,
              public dialog: MatDialog,
              private errorService: ErrorService,
              private auth: AuthService) {
    if (!this.auth.isModOrAdmin) {
      window.location.href = '/login';
    }
  }

  ngOnInit(): void {
    this.fetchTags();
  }

  fetchTags(): void {
    this.allTags = this.tagService.getAllTags();
  }

  onEdit(tagId): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '300px',
      data: { tagName: this.tagName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.tagService.editTag$(tagId, result).subscribe(() => {
          this.fetchTags();
        },
        (err) => this.errorService.errorSnackbar(err)
      );
    });
  }

  onDelete(tagId): void {
    this.tagService.deleteTag$(tagId).subscribe(() => {
      this.fetchTags();
    }, (err) => {
      this.errorService.errorSnackbar(err);
    });
  }

}
