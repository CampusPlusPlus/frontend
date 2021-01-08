import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {FullFile} from '../models/FullFile';
import {catchError, map} from 'rxjs/operators';
import {PageableResponse} from '../models/PageableResponse';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Comment} from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000/files';

  constructor(private http: HttpClient, private snackbarService: MatSnackBar) {
  }

  getAllFiles$(): Observable<FullFile[]> {
    return this.http.get(this.SERVER_URL + '/?page=0&size=10000')
      .pipe(
        map((responseData: PageableResponse<FullFile>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
          return throwError(errorResponse);
        })
      );
  }

  getAllFiles(): FullFile[] {
    const files: FullFile[] = [];
    this.getAllFiles$().subscribe(response => {
      response.forEach(f => files.push(f));
    });
    return files;
  }

  uploadFile$(formData): Observable<any> {
    return this.http.post(this.SERVER_URL,
      formData, {
        observe: 'response'
      }
    )
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
          return throwError(errorResponse);
        })
      );
  }


  addTagToFile$(fileId: number, tagId: number): Observable<any> {
    return this.http.patch(this.SERVER_URL + '/' + fileId + '/tags/' + tagId, null)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
          return throwError(errorResponse);
        })
      );
  }

  addTagToFile(fileId: number, tagId: number): void {
    this.addTagToFile$(fileId, tagId).subscribe();
  }

  getFileByID$(id: number): Observable<FullFile> {
    return this.http.get(`${this.SERVER_URL}/${id}`)
      .pipe(
        map((responseData: FullFile) => {
          return responseData;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
          return throwError(errorResponse);
        })
      );
  }

  getFileByID(id: number): FullFile {
    let file: FullFile;
    this.getFileByID$(id).subscribe(value => {
      file = value;
    });
    return file;
  }

  deleteByID(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`);
  }

  upvote(id: number): Observable<any> {
    console.log("3", "upvote", id);
    return this.http.patch(`${this.SERVER_URL}/${id}/upvote`, {});
  }

  downvote(id: number): Observable<any> {
    console.log("3", "downvote", id);
    return this.http.patch(`${this.SERVER_URL}/${id}/downvote`, {});
  }

  addCommentToFileByID(id: number, text: string): Observable<any> {
    return this.http.post(`${this.SERVER_URL}/${id}/comment`, { text });
  }

  deleteComment(comment: Comment): Observable<any> {
    // TODO: Could not be tested in development (w/o authorization).
    return this.http.delete(`${this.SERVER_URL}/${comment.fileId}/comment/${comment.id}`);
  }
}

