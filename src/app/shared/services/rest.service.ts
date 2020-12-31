import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  SERVER_URL = 'http://localhost:9000';
  disciplines = [];
  disciplineNames: string[] = [];
  disciplineID: number[] = [];
  studyCourses = [];
  studyCoursesNames = [];

  constructor(private http: HttpClient) {
  }

  getDisciplines(): any[] {
    this.http.get(
      this.SERVER_URL + '/disciplines').pipe(
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
    ).subscribe(response => {
      response.forEach(d => this.disciplines.push(d));
    });
    return this.disciplines;
  }

  getDisciplineName(): string[] {
    this.disciplines.forEach(d => this.disciplineNames.push(d.name));
    return this.disciplineNames;
  }

  getDisciplineID(name: string): number {
    let id: number;
    this.disciplines.forEach(d => {
      if (d.name === name) {
        id = d.id;
      } else {
        return null;
      }
    });
    return id;
  }


  getStudyCourseByDisciplineID(disciplineId: number): string[] {
    this.http.get(
      this.SERVER_URL + '/disciplines' + '/' + disciplineId + '/studyCourses'
    ).pipe(
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
    ).subscribe(response => {
      response.slice(0, 1).forEach(s => this.studyCourses.push(...s));
    });
    return this.studyCourses;
  }

}
