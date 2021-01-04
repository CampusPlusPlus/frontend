import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Lecture } from '../models/Lecture';
import { SimpleFile } from '../models/SimpleFile';
import { PageableResponse } from '../models/PageableResponse';

interface LectureBody {
  name: string;
  relativeSemester: number;
}

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000/lectures';

  constructor(private http: HttpClient) {
  }

  private getLectures$(): Observable<Lecture[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Lecture>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
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
    return this.http.post(this.SERVER_URL, data);
  }
}
