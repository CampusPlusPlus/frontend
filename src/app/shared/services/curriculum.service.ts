import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  SERVER_URL = 'http://localhost:9000';
  curricula = [];

  constructor(private http: HttpClient) {}

  getCurriculaID(name: string): number {
    let id: number;
    this.curricula.forEach((d) => {
      if (d.name === name) {
        id = d.id;
      } else {
        return null;
      }
    });
    return id;
  }

  getCurriculaByStudyCourse(studyCourseID: number): any[] {
    this.http
      .get(
        this.SERVER_URL + '/studyCourses' + '/' + studyCourseID + '/curricula'
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
        response.slice(0, 1).forEach((s) => this.curricula.push(...s));
      });
    return this.curricula;
  }

}
