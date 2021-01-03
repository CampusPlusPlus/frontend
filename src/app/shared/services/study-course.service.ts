import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {StudyCourse} from '../models/StudyCourse';
import {Discipline} from '../models/Discipline';
import {Curricula} from '../models/Curriculum';
import {PageableResponse} from '../models/PageableResponse';

@Injectable({
  providedIn: 'root',
})
export class StudyCourseService {
  SERVER_URL = 'http://localhost:9000/studyCourses';

  constructor(private http: HttpClient) {
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
          return throwError(errorResponse);
        })
      );
  }

  getCurriculaByStudyCourse(studyCourseID: number): Curricula[] {
    const curricula: Curricula[] = [];
    this.getCurriculaByStudyCourse$(studyCourseID)
      .subscribe((response) => {
        // @ts-ignore
        response.forEach((c) => curricula.push(c));
      });
    return curricula;
  }

  // getStudyCourseID(name: string): number {
  //   let id: number;
  //   this.studyCourses.forEach((d) => {
  //     if (d.name === name) {
  //       id = d.id;
  //     } else {
  //       return null;
  //     }
  //   });
  //   return id;
  // }

}
