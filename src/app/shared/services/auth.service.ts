import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BearerToken } from '../models/BearerToken';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rawToken: string;
  bearerToken: string;
  token: BearerToken;
  isModOrAdmin = false;
  httpHeader: HttpHeaders;
  readonly refKeycloakLogin: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/auth?client_id=frontend&response_mode=fragment&response_type=token&login=true&redirect_uri=http://localhost:4200/login';
  readonly refKeycloakProfile: string = 'http://localhost:8080/auth/realms/CampusPlusPlus/account/';
  readonly refKeycloakLogout: string = 'http://keycloak:8080/auth/realms/CampusPlusPlus/protocol/openid-connect/logout?redirect_uri=http://localhost:4200';

  constructor(private http: HttpClient) {
    this.httpHeader = new HttpHeaders();
    const rawToken = window.localStorage.getItem('rawToken');
    const parsedToken = window.localStorage.getItem('parsedToken');
    const bearerToken = window.localStorage.getItem('bearerToken');
    const accessToken = window.localStorage.getItem('access_token');
    if (rawToken && parsedToken && bearerToken && accessToken) {
      this.rawToken = rawToken;
      this.token = JSON.parse(parsedToken);
      this.bearerToken = bearerToken;
      this.token = jwt_decode(accessToken);
      console.log(this.token, new Date(this.token.exp * 1000));
      this.httpHeader = this.httpHeader.set('Authorization', `Bearer ${this.bearerToken}`);
      this.isModOrAdmin ||= !!this.token.resource_access.frontend.roles.find(elem => elem === 'moderator');
      this.isModOrAdmin ||= !!this.token.resource_access.frontend.roles.find(elem => elem === 'admin');
    }
  }

  helpMyJavaFriend(input: string): string {
    const tmp = input.split('&');
    return tmp.length >= 1 ? tmp[1].substring(tmp[1].indexOf('=') + 1) : '';
  }

  setToken(rawToken: string, res: { access_token: any; id_token: any; error: any }): void {
    this.rawToken = rawToken;
    this.bearerToken = this.helpMyJavaFriend(this.rawToken);
    window.localStorage.setItem('access_token', res.access_token);
    this.token = jwt_decode(res.access_token);
    window.localStorage.setItem('rawToken', this.rawToken);
    window.localStorage.setItem('parsedToken', JSON.stringify(res));
    window.localStorage.setItem('bearerToken', this.bearerToken);
    this.httpHeader = this.httpHeader.set('Authorization', `Bearer ${this.bearerToken}`);
    this.isModOrAdmin ||= !!this.token.resource_access.frontend.roles.find(elem => elem === 'moderator');
    this.isModOrAdmin ||= !!this.token.resource_access.frontend.roles.find(elem => elem === 'admin');
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
    this.isModOrAdmin = false;
    this.httpHeader.delete('Authorization');
    window.localStorage.removeItem('previous');
    window.localStorage.removeItem('rawToken');
    window.localStorage.removeItem('parsedToken');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('bearerToken');
    window.location.href = this.refKeycloakLogout;
  }

  ownsFile(userIDofElement: string): boolean {
    return this.token ? this.token.sub === userIDofElement : false;
  }
}
