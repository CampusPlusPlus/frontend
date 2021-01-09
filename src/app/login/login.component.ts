import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    let fromRedirect = false;
    this.route.fragment.subscribe((x) => {
      if (x.toString().length > 0) {
        fromRedirect = true;
      }
    });
    if (fromRedirect) {
      this.route.fragment.pipe(
        map(fragment => {
          return { raw: fragment, parsed: new URLSearchParams(fragment) }
        }),
        map(params => ({
          raw: params.raw,
          parsed: {
            access_token: params.parsed.get('access_token'),
            id_token: params.parsed.get('id_token'),
            error: params.parsed.get('error'),
          }
        }))
      ).subscribe(res => this.auth.setToken(res.raw, res.parsed));
    }
    if (!this.auth) {
      window.location.href = this.auth.refKeycloackLogin;
    }
    if (!this.auth.validToken()) {
      window.location.href = this.auth.refKeycloackLogin;
    }
  }

}
