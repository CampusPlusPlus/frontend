import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Tag } from '../models/Tag';
import { PageableResponse } from '../models/PageableResponse';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient, private errorService: ErrorService, private auth: AuthService) {
  }

  SERVER_URL = 'http://localhost:9000/tags';

  private static normalizeTagName(tagName: string): string {
    const lowerCasedTag = tagName.toLowerCase();
    const regex = /[!@#\$%\^\&*\)\(+=._\s]+/g;
    return lowerCasedTag.replace(regex, '-');
  }

  getAllTags$(): Observable<Tag[]> {
    return this.http.get(this.SERVER_URL)
      .pipe(
        map((responseData: PageableResponse<Tag>) => {
          return responseData.content;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorService.errorHTTPSnackbar(errorResponse);
          return throwError(errorResponse);
        })
      );
  }

  getAllTags(): Tag[] {
    const tags: Tag[] = [];
    this.getAllTags$()
      .subscribe((response) => {
        response.forEach((t) => tags.push(t));
      }, (error => this.errorService.errorHTTPSnackbar(error)));
    return tags;
  }

  createTags(tags: string[]): Promise<any>[] {
    console.log("this tags", tags);
    return tags.map(tag => this.createTag$(tag).toPromise());
  }

  // tagType not used => null
  createTag$(tagName: string, tagType: string = 'notImplemented'): Observable<any> {
    const normalizedTagName = TagService.normalizeTagName(tagName);
    return this.http.post(this.SERVER_URL, {
        tagValue: normalizedTagName,
        tagType: tagType,
      }, {
        observe: 'response',
        headers: this.auth.httpHeader
      }
    ).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  editTag$(tagId: number, newTagName: string, tagType: string = 'notImplemented'): Observable<any> {
    const normalizedTagName = TagService.normalizeTagName(newTagName);
    const id: string = String(tagId);
    return this.http.put(this.SERVER_URL + '/' + id, {
      tagValue: normalizedTagName,
      tagType: tagType,
    }, {
      observe: 'response',
      headers: this.auth.httpHeader
    });
  }

  deleteTag$(tagId: number): Observable<any> {
    if (!this.auth.isModOrAdmin) {
      this.errorService.errorUnauthorized();
      return new Observable<any>();
    }
    const id: string = String(tagId);
    return this.http.delete(this.SERVER_URL + '/' + id, {
      observe: 'response',
      headers: this.auth.httpHeader
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        this.errorService.errorHTTPSnackbar(errorResponse);
        return new Observable();
      })
    );
  }

  deleteTag(tagId: number): void {
    this.deleteTag$(tagId).subscribe();
  }

}
