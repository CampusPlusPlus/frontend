import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {FullFile} from '../models/FullFile';
import {catchError, map} from 'rxjs/operators';
import {PageableResponse} from '../models/PageableResponse';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Comment} from '../models/Comment';
import {ErrorService} from './error.service';
import {AuthService} from './auth.service';
import {SimpleFile} from '../models/SimpleFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000/files';

  constructor(private http: HttpClient, private errorService: ErrorService, private auth: AuthService) {
  }

  getAllFiles$(): Observable<FullFile[]> {
    return this.http.get(this.SERVER_URL + '/?page=0&size=10000')
      .pipe(
        map((responseData: PageableResponse<FullFile>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getAllFiles(): FullFile[] {
    const files: FullFile[] = [];
    this.getAllFiles$().subscribe(response => {
      response.forEach(f => files.push(f));
    }, error => this.errorService.errorHTTPSnackbar(error));
    return files;
  }

  uploadFile$(formData): Observable<any> {
    console.log('inside uploadFile: ', this.auth.httpHeader);
    return this.http.post(this.SERVER_URL,
      formData, {
        observe: 'response',
        headers: this.auth.httpHeader
      })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          // this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  addTagToFile$(file: FullFile | SimpleFile, tagId: number): Observable<any> {
    if (!this.auth.isModOrAdmin && !!file && !this.auth.ownsFile(file.authorId)) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.patch(this.SERVER_URL + '/' + file.id + '/tags/' + tagId, {}, {
      headers: this.auth.httpHeader
    })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  removeTagFromFile$(file: FullFile, tagId: number): Observable<any> {
    if (!this.auth.isModOrAdmin && !!file && !this.auth.ownsFile(file.authorId)) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.delete(this.SERVER_URL + '/' + file.id + '/tags/' + tagId, {
      headers: this.auth.httpHeader
    })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  addTagToFile(file: SimpleFile, tagId: number): void {
    this.addTagToFile$(file, tagId).subscribe();
  }

  getFileByID$(id: number): Observable<FullFile> {
    return this.http.get(`${this.SERVER_URL}/${id}`)
      .pipe(
        map((responseData: FullFile) => {
          return responseData;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getFileByID(id: number): FullFile {
    let file: FullFile;
    this.getFileByID$(id).subscribe(value => {
      file = value;
    }, (error => this.errorService.errorHTTPSnackbar(error)));
    return file;
  }

  deleteFile(file: FullFile | SimpleFile): Observable<any> {
    if (!this.auth.isModOrAdmin && !this.auth.ownsFile(file.authorId)) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.delete(`${this.SERVER_URL}/${file.id}`, {headers: this.auth.httpHeader})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  upvote(id: number): Observable<any> {
    return this.http.patch(`${this.SERVER_URL}/${id}/upvote`, {}, {headers: this.auth.httpHeader})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  downvote(id: number): Observable<any> {
    return this.http.patch(`${this.SERVER_URL}/${id}/downvote`, {}, {headers: this.auth.httpHeader})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  removevote(id: number): Observable<any> {
    return this.http.patch(`${this.SERVER_URL}/${id}/removeVote`, {}, {headers: this.auth.httpHeader})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  addCommentToFileByID(id: number, text: string): Observable<any> {
    return this.http.post(`${this.SERVER_URL}/${id}/comment`, {text}, {headers: this.auth.httpHeader}).pipe()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }

  deleteComment(comment: Comment): Observable<any> {
    if (!this.auth.isModOrAdmin && !this.auth.ownsFile(comment.authorId)) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.delete(`${this.SERVER_URL}/${comment.fileId}/comments/${comment.id}`, {headers: this.auth.httpHeader})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return new Observable();
        })
      );
  }
}

