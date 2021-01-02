import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  SERVER_URL = 'http://localhost:9000/tags';
  tags = [];

  constructor(private http: HttpClient) {
  }

  getAllTags() {
    this.http
      .get(this.SERVER_URL)
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
        response.slice(0, 1).forEach((t) => this.tags.push(...t));
      });
    return this.tags;
  }

  createTag(tagName: string, tagType: string) {
    this.http.post(this.SERVER_URL, {
      'tagValue': tagName,
      'tagType': tagType,
    }).subscribe(response => console.log(response));
  }

}
