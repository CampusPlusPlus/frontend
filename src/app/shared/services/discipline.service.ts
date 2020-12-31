import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  SERVER_URL = 'http://localhost:9000';
  disciplines = [];
  disciplineNames: string[] = [];

  constructor(private http: HttpClient) {
  }

  getDisciplines(): any[] {
    this.http
      .get(this.SERVER_URL + '/disciplines')
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
      )
      .subscribe((response) => {
        response.forEach((d) => this.disciplines.push(d));
      });
    return this.disciplines;
  }

  getDisciplineName(): string[] {
    this.disciplines.forEach((d) => this.disciplineNames.push(d.name));
    return this.disciplineNames;
  }

  getDisciplineID(name: string): number {
    let id: number;
    this.disciplines.forEach((d) => {
      if (d.name === name) {
        id = d.id;
      } else {
        return null;
      }
    });
    return id;
  }
}
