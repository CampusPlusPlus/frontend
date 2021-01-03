import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {File} from '../models/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000/files';

  constructor(private http: HttpClient) {
  }

  uploadFile(formData): Observable<File> {
    return this.http.post<any>(this.SERVER_URL,
      formData
    );
  }

}

