import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SimpleFile} from '../models/SimpleFile';
import {catchError, map} from 'rxjs/operators';
import {PageableResponse} from '../models/PageableResponse';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000/files';

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getAllFiles$(): Observable<SimpleFile[]> {
    return this.http.get(this.SERVER_URL + '/?page=0&size=10000')
      .pipe(
        map((responseData: PageableResponse<SimpleFile>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getAllFiles(): SimpleFile[] {
    const files: SimpleFile[] = [];
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
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }


  addTagToFile$(fileId: number, tagId: number): Observable<any> {
    return this.http.patch(this.SERVER_URL + '/' + fileId + '/tags/' + tagId, null)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  addTagToFile(fileId: number, tagId: number): void {
    this.addTagToFile$(fileId, tagId).subscribe();
  }

  getFileByID$(id: number): Observable<SimpleFile> {
    return this.http.get(`${this.SERVER_URL}/${id}`)
      .pipe(
        map((responseData: SimpleFile) => {
          return responseData;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getFileByID(id: number): SimpleFile {
    let file: SimpleFile;
    this.getFileByID$(id).subscribe(value => {
      file = value;
    });
    return file;
  }

  deleteByID(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  upvote(id: number): Observable<any> {
    console.log("3", "upvote", id);
    return this.http.patch(`${this.SERVER_URL}/${id}/upvote`, {})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  downvote(id: number): Observable<any> {
    console.log("3", "downvote", id);
    return this.http.patch(`${this.SERVER_URL}/${id}/downvote`, {})
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }
}

