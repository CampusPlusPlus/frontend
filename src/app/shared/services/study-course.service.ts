import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { StudyCourse } from '../models/StudyCourse';
import { Curricula } from '../models/Curriculum';
import { PageableResponse } from '../models/PageableResponse';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root',
})
export class StudyCourseService {
  SERVER_URL = 'http://localhost:9000/studyCourses';

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  private getAllStudyCourses$(): Observable<StudyCourse[]> {
    return this.http.get(this.SERVER_URL).pipe(
      map((responseData) => {
        const studyCourseArray = [];
        for (const key in responseData) {
          studyCourseArray.push(responseData[key]);
        }
        return studyCourseArray;
      }),
      catchError((errorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  getAllStudyCourses(): StudyCourse[] {
    const studyCourses: StudyCourse[] = [];
    this.getAllStudyCourses$()
      .subscribe(response => {
        response.forEach(s => studyCourses.push(s));
      });
    return studyCourses;
  }

  private getCurriculaByStudyCourse$(studyCourseID: number): Observable<Curricula[]> {
    return this.http
      .get(
        this.SERVER_URL + '/' + studyCourseID + '/curricula'
      )
      .pipe(
        map((responseData: PageableResponse<Curricula>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getCurriculaByStudyCourse(studyCourseID: number): Curricula[] {
    const curricula: Curricula[] = [];
    this.getCurriculaByStudyCourse$(studyCourseID)
      .subscribe((response) => {
        response.forEach((c) => curricula.push(c));
      });
    return curricula;
  }

  createStudyCourse(data: object): Observable<any> {
    return this.http.post(this.SERVER_URL, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  deleteStudyCourse(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  updateStudyCourseByID(id: number, data: { name: any; disciplineId: number }): Observable<any> {
    return this.http.put(`${this.SERVER_URL}/${id}`, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return throwError(errorResponse);
      })
    );
  }
}
