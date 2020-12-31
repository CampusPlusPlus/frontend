import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000';
  lectures = [];

  constructor(private http: HttpClient) { }

  getLecturesByCurriculaID(curriculaID: number): any[] {
    this.http
      .get(
        this.SERVER_URL + '/curricula' + '/' + curriculaID + '/lectures'
      )
      .pipe(
        map((responseData) => {
          const array = [];
          for (const key in responseData) {
            array.push(responseData[key]);
          }
          return array;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      )
      .subscribe((response) => {
        response.slice(0, 1).forEach((s) => this.lectures.push(...s));
      });
    return this.lectures;
  }
}
