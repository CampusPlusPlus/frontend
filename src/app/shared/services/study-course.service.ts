import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StudyCourseService {
  SERVER_URL = 'http://localhost:9000';
  studyCourses = [];
  studyCoursesNames = [];

  constructor(private http: HttpClient) {
  }

  getAllStudyCourses(): Observable<any> {
    return this.http.get(
      this.SERVER_URL + '/StudyCourses').pipe(
      map((responseData) => {
        const disciplineArray = [];
        for (const key in responseData) {
          disciplineArray.push(responseData[key]);
        }
        return disciplineArray;
      }),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }
}
