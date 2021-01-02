import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() {
  }

  arrayIsEmpty(array: any[]): Error {
    if (array.length < 1) {
      return new Error(array + ' array is empty, maybe it still needs init');
    }
  }
}
