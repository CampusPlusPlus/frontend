import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  SERVER_URL = 'http://localhost:9000';
  curricula = [];

  constructor(private http: HttpClient, private errorService: ErrorService) {
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

  getCurriculaNameFromObjectArray(): string[] {
    const curriculaName: string[] = [];
    this.errorService.arrayIsEmpty(this.curricula);
    this.curricula.forEach(c => curriculaName.push(c.name));
    return curriculaName;
  }

  getCurriculaIDByName(name: string): number {
    let id: number;
    this.errorService.arrayIsEmpty(this.curricula);
    this.curricula.forEach((c) => {
      if (c.name === name) {
        id = c.id;
      } else {
        return new Error('no id could be found for the curricula ' + name);
      }
    });
    return id;
  }

}
