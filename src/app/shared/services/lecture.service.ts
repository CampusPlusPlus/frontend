import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Lecture } from '../models/Lecture';
import { PageableResponse } from '../models/PageableResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimpleFile } from '../models/SimpleFile';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

interface LectureBody {
  name: string;
  relativeSemester: number;
}

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000/lectures';

  constructor(private http: HttpClient, private errorService: ErrorService, private auth: AuthService) {
  }

  private getLectures$(): Observable<Lecture[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Lecture>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getLectures(): Lecture[] {
    const lectures: Lecture[] = [];
    this.getLectures$()
      .subscribe((response) => {
        response.forEach((l) => lectures.push(l));
      }, (error => this.errorService.errorHTTPSnackbar(error)));
    return lectures;
  }

  getFilesByLectureID$(id: number): Observable<SimpleFile[]> {
    return this.http.get(`${this.SERVER_URL}/${id}/files`)
      .pipe(
        map((responseData: PageableResponse<SimpleFile>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getFilesByLectureID(id: number): SimpleFile[] {
    const files: SimpleFile[] = [];
    this.getFilesByLectureID$(id).subscribe((response) => {
      response.forEach((l) => files.push(l));
    }, (error => this.errorService.errorHTTPSnackbar(error)));
    return files;
  }

  createLecture(data: object): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.post(this.SERVER_URL, data, { headers: this.auth.httpHeader }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  deleteLecture(id: number): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.delete(`${this.SERVER_URL}/${id}`, { headers: this.auth.httpHeader }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  updateLectureByID(id: number, data: { name: any; relativeSemester: any; curriculumId: number }): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.put(`${this.SERVER_URL}/${id}`, data, { headers: this.auth.httpHeader }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }
}
