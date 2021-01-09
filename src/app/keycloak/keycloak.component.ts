import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-keycloak',
  templateUrl: './keycloak.component.html',
  styleUrls: ['./keycloak.component.scss']
})
export class KeycloakComponent implements OnInit {

  constructor(private auth: AuthService, private location: Location) {
  }

  ngOnInit(): void {
    window.open(this.auth.refKeycloakProfile, '_blank');
  }

  refresh(): void {
    window.location.href = '/';
  }

  goBack() {
    this.location.back()
  }
}
