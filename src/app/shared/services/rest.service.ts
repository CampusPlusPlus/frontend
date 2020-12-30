import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Discipline} from '../models/Discipline';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  SERVER_URL = 'localhost:9000';
  disciplines = [];
  disciplineNames: string[] = [];
  disciplineID: number[] = [];
  studyCourses: string[] = [];

  constructor(private http: HttpClient) {
  }

  // TODO: Disciplines are returned with the worng id
  getDisciplines() {
    this.http.get<{ [name: string]: Discipline }>(
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
    ).subscribe(response => {
      response.forEach(d => this.disciplines.push(d));
    });
    console.log(this.disciplines);
    return this.disciplines;
  }

  getDisciplineName(): string[] {
    this.disciplines.forEach(d => this.disciplineNames.push(d.name));
    return this.disciplineNames;
  }

  // getDisciplineIDByName(disciplineName: string): number {
  //   let id: number = null;
  //   this.getDisciplines().subscribe(response => {
  //     response.forEach(d => {
  //       if (d.name === disciplineName) {
  //         id = d.id;
  //       } else {
  //         id = null;
  //       }
  //     });
  //   });
  //   return id;
  // }

  getDisciplineID(name: string): number {
    let id: number;
    this.disciplines.forEach(d => {
      if (d.name === name) {
        id = d.id;
      } else {
        return null;
      }
    });
    return id;
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

  // TODO: response data is false get request in post man works right
  getStudyCourseByDisciplineID(disciplineId: number) {
    console.log(this.SERVER_URL + '/disciplines' + '/' + disciplineId + '/studyCourses');
    // this.http.get(
    //   this.SERVER_URL + '/disciplines' + '/' + disciplineId + '/studyCourses'
    // ).pipe(
    //   map((responseData) => {
    //     console.log(responseData);
    //     const array = [];
    //     for (const key in responseData) {
    //       array.push(responseData[key]);
    //     }
    //     console.log('a' + array);
    //     return array;
    //   }),
    //   catchError((errorResponse) => {
    //     return throwError(errorResponse);
    //   })
    // ).subscribe(response => {
    //   response.forEach(s => this.studyCourses.push(s));
    // });
    // return this.studyCourses;
  }

}
