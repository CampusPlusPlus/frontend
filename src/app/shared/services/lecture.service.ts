import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';
import {Lecture} from '../models/Lecture';

@Injectable({
  providedIn: 'root'
})
export class LectureService {
  SERVER_URL = 'http://localhost:9000/lectures';
  lectures = [];

  constructor(private http: HttpClient) {
  }

  getLectures$(): Observable<Lecture[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData) => {
          const lectureArray = [];
          for (const key in responseData) {
            lectureArray.push(responseData[key]);
          }
          return lectureArray;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getLectures(): Lecture[] {
    const lectures: Lecture[] = [];
    this.getLectures$()
      .subscribe((response) => {
        // @ts-ignore
        response.slice(0, 1).forEach((l) => lectures.push(...l));
      });
    return lectures;
  }


}
