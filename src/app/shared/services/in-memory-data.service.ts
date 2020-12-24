import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Discipline } from '../models/Discipline';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  constructor() { }

  createDb(): {} | Observable<{}> | Promise<{}> {
    const disciplines = [
      { name: 'Applied Life Sciences', id: 1 },
      { name: 'Engineering', id: 2 },
      { name: 'Building and Design', id: 3 },
      { name: 'Administration, Economics, Security, Politics', id: 4 },
      { name: 'Health Sciences', id: 5 },
      { name: 'Nursing Science', id: 6 },
      { name: 'Social Work', id: 7 }
    ];
    return {disciplines};
  }

}
