import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';
import {Lecture} from '../models/Lecture';
import { File } from '../models/File';
import {PageableResponse} from '../models/PageableResponse';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000/lectures';

  constructor(private http: HttpClient) {
  }

  getLectures$(): Observable<Lecture[]> {
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

  getFilesByLectureID$(id: number): Observable<File[]> {
    return this.http.get(`${this.SERVER_URL}/${id}/files`)
      .pipe(
        map((responseData: PageableResponse<File>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }


}
