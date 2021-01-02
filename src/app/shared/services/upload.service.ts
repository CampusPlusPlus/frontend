import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  SERVER_URL = 'https://file.io/';

  constructor(private httpClient: HttpClient, private userService: UserService) {}

  public upload(formData): any {
    return this.httpClient.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
