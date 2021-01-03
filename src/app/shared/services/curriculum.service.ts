import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from './error.service';
import { Lecture } from '../models/Lecture';
import { PageableResponse } from '../models/PageableResponse';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  SERVER_URL = 'http://localhost:9000/curricula';

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }


  getLecturesByCurriculaID$(curriculaID: number): Observable<Lecture[]> {
    return this.http
      .get(
        this.SERVER_URL + '/' + curriculaID + '/lectures?page=0&size=10000'
      )
      .pipe(
        map((responseData: PageableResponse<Lecture>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getLecturesByCurriculaID(curriculaID: number): Lecture[] {
    const lectures: Lecture[] = [];
    this.getLecturesByCurriculaID$(curriculaID)
      .subscribe((response) => {
        // @ts-ignore
        response.forEach((s) => lectures.push(s));
      });
    return lectures;
  }

  getLecturesByCurriculaIDGroupedByRelativeSemester(curriculaID: number): Array<Lecture[]> {
    const lectures: Array<Lecture[]> = [];
    this.getLecturesByCurriculaID$(curriculaID)
      .subscribe((response) => {
        response.forEach((s) => {
          while (lectures.length < s.relativeSemester) {
            lectures.push([]);
          }
          lectures[s.relativeSemester - 1].push(s);
        });
      });
    return lectures;
  }


  // getCurriculaNameFromObjectArray(): string[] {
  //   const curriculaName: string[] = [];
  //   this.errorService.arrayIsEmpty(this.curricula);
  //   this.curricula.forEach(c => curriculaName.push(c.name));
  //   return curriculaName;
  // }
  //
  // getCurriculaIDByName(name: string): number {
  //   let id: number;
  //   this.curricula.forEach((c) => {
  //     if (c.name === name) {
  //       id = c.id;
  //     } else {
  //       return new Error('no id could be found for the curricula ' + name);
  //     }
  //   });
  //   return id;
  // }

}
