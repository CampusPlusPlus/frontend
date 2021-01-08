import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Lecture } from '../models/Lecture';
import { PageableResponse } from '../models/PageableResponse';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SimpleFile } from '../models/SimpleFile';
import {ErrorService} from './error.service';

interface LectureBody {
  name: string;
  relativeSemester: number;
}

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000/lectures';

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  private getLectures$(): Observable<Lecture[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Lecture>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getLectures(): Lecture[] {
    const lectures: Lecture[] = [];
    this.getLectures$()
      .subscribe((response) => {
        response.forEach((l) => lectures.push(l));
      });
    return lectures;
  }

  getFilesByLectureID$(id: number): Observable<SimpleFile[]> {
    return this.http.get(`${this.SERVER_URL}/${id}/files`)
      .pipe(
        map((responseData: PageableResponse<SimpleFile>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getFilesByLectureID(id: number): SimpleFile[] {
    const files: SimpleFile[] = [];
    this.getFilesByLectureID$(id).subscribe((response) => {
      response.forEach((l) => files.push(l));
    });
    return files;
  }

  createLecture(data: object): Observable<any> {
    return this.http.post(this.SERVER_URL, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  deleteLecture(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  updateLectureByID(id: number, data: { name: any; relativeSemester: any; curriculumId: number }): Observable<any> {
    return this.http.put(`${this.SERVER_URL}/${id}`, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }
}
