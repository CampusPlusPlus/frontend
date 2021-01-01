import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {StudyCourse} from "../models/StudyCourse";

@Injectable({
  providedIn: 'root',
})
export class StudyCourseService {
  SERVER_URL = 'http://localhost:9000';
  studyCourses = [];

  constructor(private http: HttpClient) {}

  getAllStudyCourses(): Observable<any> {
    return this.http.get(this.SERVER_URL + '/StudyCourses').pipe(
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

  getStudyCourseID(name: string): number {
    let id: number;
    this.studyCourses.forEach((d) => {
      if (d.name === name) {
        id = d.id;
      } else {
        return null;
      }
    });
    return id;
  }

  getStudyCourseByDisciplineID(disciplineId: number): StudyCourse[] {
    this.http
      .get(
        this.SERVER_URL + '/disciplines' + '/' + disciplineId + '/studyCourses'
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
        response.slice(0, 1).forEach((s) => this.studyCourses.push(...s));
      });
    return this.studyCourses;
  }

  // getStudyCourseNamesByDisciplineID(disciplineId: number){
  //   this.getStudyCourseByDisciplineID(disciplineId);
  // }

}
