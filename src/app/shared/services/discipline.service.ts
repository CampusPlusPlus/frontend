import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Discipline } from '../models/Discipline';
import { StudyCourse } from '../models/StudyCourse';
import { PageableResponse } from '../models/PageableResponse';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  SERVER_URL = 'http://localhost:9000/disciplines';

  constructor(private http: HttpClient, private errorService: ErrorService, private auth: AuthService) {
  }

  private getDisciplines$(): Observable<Discipline[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: Discipline[]) => {
          return responseData;
        }),
        catchError((errorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getDisciplines(): Discipline[] {
    const disciplines: Discipline[] = [];
    this.getDisciplines$()
      .subscribe((response) => {
        response.forEach((d) => disciplines.push(d));
      }, (error => this.errorService.errorHTTPSnackbar(error)));
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
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getStudyCoursesByDisciplineID(disciplineId: number): StudyCourse[] {
    const studyCourses: StudyCourse[] = [];
    this.getStudyCoursesByDisciplineID$(disciplineId)
      .subscribe((response) => {
        response.forEach((s) => studyCourses.push(s));
      }, (error => this.errorService.errorHTTPSnackbar(error)));
    return studyCourses;
  }

  createDiscipline(data: object): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.post(this.SERVER_URL, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  deleteDiscipline(id: number): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.delete(`${this.SERVER_URL}/${id}`).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  updateDisciplineByID(id: number, data: { name: any }): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    return this.http.put(`${this.SERVER_URL}/${id}`, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }
}
