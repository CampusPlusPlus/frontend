import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Tag} from '../models/Tag';
import {PageableResponse} from '../models/PageableResponse';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  SERVER_URL = 'http://localhost:9000/tags';

  constructor(private http: HttpClient, private snackbarService: MatSnackBar) {
  }


  getAllTags$(): Observable<Tag[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Tag>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.snackbarService.open(errorResponse.message);
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
    const normalizedTagName = tagName.toLowerCase();
    return this.http.post(this.SERVER_URL, {
        tagValue: normalizedTagName,
        tagType: tagType,
      }, {
        observe: 'response'
      }
    ).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 409) {
          this.snackbarService.open('This Tag already exists');
        } else {
          this.snackbarService.open(errorResponse.message);
        }
        console.log(errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  deleteTag$(tagId: number): Observable<any> {
    const id: string = String(tagId);
    return this.http.delete(this.SERVER_URL + '/' + id, {
      observe: 'response'
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.snackbarService.open(errorResponse.message);
        return throwError(errorResponse);
      })
    );
  }

  deleteTag(tagId: number): void {
    this.deleteTag$(tagId).subscribe();
  }

}
