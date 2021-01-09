import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BearerToken } from '../models/BearerToken';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rawToken: string;
  token: BearerToken;
  readonly refKeycloackLogin: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/auth?client_id=frontend&response_mode=fragment&response_type=token&login=true&redirect_uri=http://localhost:4200/login';
  readonly refKeycloackProfile: string = 'http://localhost:8080/auth/realms/CampusPlusPlus/account/';
  readonly refKeycloackLogout: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/logout?redirect_uri=http://localhost:4200';

  constructor(private http: HttpClient) {
  }

  setToken(rawToken: string, res: { access_token: any; id_token: any; error: any }): void {
    this.rawToken = rawToken;
    this.token = jwt_decode(res.access_token);
  }

  validToken(): boolean {
    if (!this.token) {
      return false;
    }
    const now = new Date();
    const expiryDate = new Date(now.getTime() + this.token.exp * 1000);
    if (expiryDate <= now) {
      this.token = null;
    }
    return !!this.token;
  }

  logout(): void {
    console.log(this.rawToken);
    window.location.href = this.refKeycloackLogout;
    // this.http.get(this.refKeycloackLogout + '?token=' + this.rawToken).subscribe((res) => {
    //   console.log('res', res);
    // });
  }
}
