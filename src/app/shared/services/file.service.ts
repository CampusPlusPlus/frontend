import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  fileUpload(lectureId: number, file: FormData){
    return this.http.post(this.SERVER_URL + '/files',
      {
        lectureId, file
      });
  }
  public sendFormData(formData) {
    return this.http.post<any>(this.SERVER_URL + 'files', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}

