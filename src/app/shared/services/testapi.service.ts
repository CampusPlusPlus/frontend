import { Injectable } from '@angular/core';
import { Discipline } from '../models/Discipline';
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestapiService {

  private discipline: Array<Discipline> = [
    { name: 'Applied Life Sciences', id: 1 },
    { name: 'Engineering', id: 2 },
    { name: 'Building and Design', id: 3 },
    { name: 'Administration, Economics, Security, Politics', id: 4 },
    { name: 'Health Sciences', id: 5 },
    { name: 'Nursing Science', id: 6 },
    { name: 'Social Work', id: 7 }
  ];

  constructor() {
  }

  getDisciplines(): Observable<Array<Discipline>> {
    return of(this.discipline);
  }

}
