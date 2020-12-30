import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  SERVER_URL = 'localhost:9000';

  constructor(private http: HttpClient) {
  }

  getDisciplines(): Observable<any> {
    return this.http.get<{ [name: string]: Discipline }>(
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
    );
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

  getStudyCourseByDiscipline() {
  }

}
