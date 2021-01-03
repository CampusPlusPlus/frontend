import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Tag} from '../models/Tag';
import {Lecture} from '../models/Lecture';
import {PageableResponse} from '../models/PageableResponse';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  SERVER_URL = 'http://localhost:9000/tags';
  tags = [];

  constructor(private http: HttpClient) {
  }


  getAllTags$(): Observable<Tag[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Tag>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getAllTags() {
    const tags: Tag[] = [];
    this.getAllTags$()
      .subscribe((response) => {
        response.forEach((t) => tags.push(t));
      });
    return tags;
  }

  createTag(tagName: string, tagType: string) {
    this.http.post(this.SERVER_URL, {
      'tagValue': tagName,
      'tagType': tagType,
    }).subscribe(response => console.log(response));
  }

}
