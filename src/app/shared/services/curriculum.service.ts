import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Lecture} from '../models/Lecture';
import {PageableResponse} from '../models/PageableResponse';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  SERVER_URL = 'http://localhost:9000/curricula';

  constructor(private http: HttpClient, private snackbarService: MatSnackBar) {
  }


  private getLecturesByCurriculaID$(curriculaID: number): Observable<Lecture[]> {
    return this.http
      .get(
        this.SERVER_URL + '/' + curriculaID + '/lectures?page=0&size=10000'
      )
      .pipe(
        map((responseData: PageableResponse<Lecture>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
          return throwError(errorResponse);
        })
      );
  }

  getLecturesByCurriculaID(curriculaID: number): Lecture[] {
    const lectures: Lecture[] = [];
    this.getLecturesByCurriculaID$(curriculaID)
      .subscribe((response) => {
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

  createCurriculum(data: object): Observable<any> {
    return this.http.post(this.SERVER_URL, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.snackbarService.open(errorResponse.message);
        return throwError(errorResponse);
      })
    );
  }

  deleteCurriculum(id: number): Observable<any> {
    return this.http.delete(`${this.SERVER_URL}/${id}`).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.snackbarService.open(errorResponse.message);
        return throwError(errorResponse);
      })
    );
  }

  updateCurriculumByID(id: number, data: { studyCourseId: number; name: any }): Observable<any> {
    return this.http.put(`${this.SERVER_URL}/${id}`, data).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.snackbarService.open(errorResponse.message);
        return throwError(errorResponse);
      })
    );
  }
}
