import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import { Observable, Subscription, throwError } from 'rxjs';
import { Discipline } from "../models/Discipline";

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  SERVER_URL = 'http://localhost:9000';
  disciplines = [];
  disciplineNames: string[] = [];

  constructor(private http: HttpClient) {
  }

  getDisciplines$(): Observable<Discipline[]> {
    return this.http.get(this.SERVER_URL + '/disciplines')
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

}
