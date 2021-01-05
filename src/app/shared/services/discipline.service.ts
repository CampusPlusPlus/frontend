import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';
import {StudyCourse} from '../models/StudyCourse';
import {PageableResponse} from '../models/PageableResponse';
import {Lecture} from '../models/Lecture';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  SERVER_URL = 'http://localhost:9000/disciplines';

  constructor(private http: HttpClient) {
  }

  private getDisciplines$(): Observable<Discipline[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: Discipline[]) => {
          return responseData;
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

  private getStudyCoursesByDisciplineID$(disciplineId: number): Observable<StudyCourse[]> {
    return this.http
      .get(this.SERVER_URL + '/' + disciplineId + '/studyCourses')
      .pipe(
        map((responseData: PageableResponse<StudyCourse>) => {
          return responseData.content;
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
        response.forEach((s) => studyCourses.push(s));
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

  createDiscipline(data: object): Observable<any> {
    return this.http.post(this.SERVER_URL, data);
  }

  deleteDiscipline(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`);
  }

  updateDisciplineByID(id: number, data: { name: any }): Observable<any> {
    return this.http.put(`${this.SERVER_URL}/${id}`, data);
  }
}
