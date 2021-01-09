import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Tag} from '../models/Tag';
import {PageableResponse} from '../models/PageableResponse';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  SERVER_URL = 'http://localhost:9000/tags';

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }


  getAllTags$(): Observable<Tag[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Tag>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getAllTags(): Tag[] {
    const tags: Tag[] = [];
    this.getAllTags$()
      .subscribe((response) => {
        response.forEach((t) => tags.push(t));
      }, (error => this.errorService.errorSnackbar(error)));
    return tags;
  }

  // tagType not used => null
  createTag$(tagName: string, tagType: string = 'notImplemented'): Observable<any> {
    const normalizedTagName = tagName.toLowerCase();
    return this.http.post(this.SERVER_URL, {
        tagValue: normalizedTagName,
        tagType: tagType,
      }, {
        observe: 'response'
      }
    ).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  deleteTag$(tagId: number): Observable<any> {
    const id: string = String(tagId);
    return this.http.delete(this.SERVER_URL + '/' + id, {
      observe: 'response'
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  deleteTag(tagId: number): void {
    this.deleteTag$(tagId).subscribe();
  }

}
