import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Tag} from '../models/Tag';
import {PageableResponse} from '../models/PageableResponse';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  SERVER_URL = 'http://localhost:9000/tags';

  constructor(private http: HttpClient) {
  }


  getAllTags$(): Observable<Tag[]> {
    return this.http.get(this.SERVER_URL + '/?page=0&size=10000')
      .pipe(
        map((responseData: PageableResponse<Tag>) => {
          return responseData.content;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getAllTags(): Tag[] {
    const tags: Tag[] = [];
    this.getAllTags$()
      .subscribe((response) => {
        response.forEach((t) => tags.push(t));
      });
    return tags;
  }

  // tagType not used => null
  createTag$(tagName: string, tagType: string = 'notImplemented'): Observable<any> {
    return this.http.post(this.SERVER_URL, {
        'tagValue': tagName,
        'tagType': tagType,
      }, {
        observe: 'response'
      }
    );
  }

  deleteTag$(tagId: number): Observable<any> {
    const id: string = String(tagId);
    return this.http.delete(this.SERVER_URL + '/' + id, {
      observe: 'response'
    });
  }

  deleteTag(tagId: number): void {
    this.deleteTag$(tagId).subscribe();
  }

}
