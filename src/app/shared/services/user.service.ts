import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  SERVER_URL: string;

  constructor(private http: HttpClient) {
  }

  // TODO: make dynamic does not work yet
  getUserAccessToken() {
    const postData = {
      clientId: 'frontend',
      username: 'user1',
      password: 'asdf',
      grant_type: 'password'
    };
    return this.http.post(this.SERVER_URL, {
      postData
    }).pipe(tap(request => {
        console.log(request);
      }
    ));
  }
}
