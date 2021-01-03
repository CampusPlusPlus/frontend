import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';
import {StudyCourse} from '../models/StudyCourse';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  SERVER_URL = 'http://localhost:9000/disciplines';

  constructor(private http: HttpClient) {
  }

  getDisciplines$(): Observable<Discipline[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
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

  getDisciplines(): Discipline[] {
    const disciplines: Discipline[] = [];
    this.getDisciplines$()
      .subscribe((response) => {
        response.forEach((d) => disciplines.push(d));
      });
    return disciplines;
  }

  getStudyCoursesByDisciplineID$(disciplineId: number): Observable<StudyCourse[]> {
    return this.http
      .get(
        this.SERVER_URL + '/' + disciplineId + '/studyCourses'
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
      );
  }

  getStudyCoursesByDisciplineID(disciplineId: number): StudyCourse[] {
    const studyCourses: StudyCourse[] = [];
    this.getStudyCoursesByDisciplineID$(disciplineId)
      .subscribe((response) => {
        // @ts-ignore
        response.slice(0, 1).forEach((s) => studyCourses.push(...s));
      });
    return studyCourses;
  }

  // getStudyCourseNamesByDisciplineID(disciplineId: number): string[] {
  //   const studyCourseNames: string[] = [];
  //   this.getStudyCoursesByDisciplineID$(disciplineId)
  //     .subscribe((response) => {
  //       response.slice(0, 1).forEach((s) => studyCourseNames.push(...s.name));
  //     });
  //   return studyCourseNames;
  // }

}
