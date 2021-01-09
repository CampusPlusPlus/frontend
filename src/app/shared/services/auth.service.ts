import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BearerToken } from '../models/BearerToken';
import { HttpClient } from '@angular/common/http';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rawToken: string;
  token: BearerToken;
  isModOrAdmin = false;
  readonly refKeycloakLogin: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/auth?client_id=frontend&response_mode=fragment&response_type=token&login=true&redirect_uri=http://localhost:4200/login';
  readonly refKeycloakProfile: string = 'http://localhost:8080/auth/realms/CampusPlusPlus/account/';
  readonly refKeycloakLogout: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/logout?redirect_uri=http://localhost:4200';

  constructor(private http: HttpClient) {
  }

  setToken(rawToken: string, res: { access_token: any; id_token: any; error: any }): void {
    this.rawToken = rawToken;
    this.token = jwt_decode(res.access_token);
    this.isModOrAdmin ||= this.token.resource_access.frontend.roles.find(elem => elem === 'moderator') !== '';
    this.isModOrAdmin ||= this.token.resource_access.frontend.roles.find(elem => elem === 'admin') !== '';
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
    this.isModOrAdmin = false;
    window.location.href = this.refKeycloakLogout;
    // this.http.get(this.refKeycloackLogout + '?token=' + this.rawToken).subscribe((res) => {
    //   console.log('res', res);
    // });
  }

  ownsFile(id: string): boolean {
    return this.token ? this.token.sub === id : false;
  }
}
