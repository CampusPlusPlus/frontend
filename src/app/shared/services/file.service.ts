import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SimpleFile} from '../models/SimpleFile';
import {FullFile} from '../models/FullFile';
import {catchError, map} from 'rxjs/operators';
import {PageableResponse} from '../models/PageableResponse';
import {Lecture} from '../models/Lecture';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  SERVER_URL = 'http://localhost:9000/files';

  constructor(private http: HttpClient) {
  }

  getAllFiles$(): Observable<SimpleFile[]> {
    return this.http.get(this.SERVER_URL + '/?page=0&size=10000')
      .pipe(
        map((responseData: PageableResponse<SimpleFile>) => {
          console.log(responseData);
          return responseData.content;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getAllFiles(): SimpleFile[] {
    const files: SimpleFile[] = [];
    this.getAllFiles$().subscribe(response => {
      response.forEach(f => files.push(f));
    });
    return files;
  }

  private uploadFile$(formData): Observable<SimpleFile> {
    return this.http.post<any>(this.SERVER_URL,
      formData
    );
  }

  uploadFile(formData): void {
    this.uploadFile$(formData).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  private addTagToFile$(fileId: number, tagId: number): Observable<any> {
    return this.http.patch(this.SERVER_URL + fileId + tagId, null);
  }

  addTagToFile(fileId: number, tagId: number): void {
    this.addTagToFile$(fileId, tagId).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  getFileByID$(id: number): Observable<SimpleFile> {
    return this.http.get(`${this.SERVER_URL}/${id}`)
      .pipe(
        map((responseData: SimpleFile) => {
          console.log("reeee", responseData);
          return responseData;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  getFileByID(id: number): SimpleFile {
    let file: SimpleFile;
    this.getFileByID$(id).subscribe(value => {
      file = value;
    });
    return file;
  }

}

