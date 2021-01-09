import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { filter, map, pairwise } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  previousURL: string;
  progressbarValue = 0;
  curSec = 0;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (window.localStorage.getItem('previous')) {
      console.log('history', window.localStorage.getItem('previous'));
      this.previousURL = window.localStorage.getItem('previous');
    } else {
      console.log('no history');
    }
  }

  ngOnInit(): void {
    let fromRedirect = false;
    this.route.fragment.subscribe((x) => {
      if (x && x.toString().length > 0) {
        fromRedirect = true;
      }
    });
    if (fromRedirect) {
      this.route.fragment.pipe(
        map(fragment => {
          return { raw: fragment, parsed: new URLSearchParams(fragment) };
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
      window.location.href = this.auth.refKeycloakLogin;
    }
    if (!this.auth.validToken()) {
      window.location.href = this.auth.refKeycloakLogin;
    }
    if (window.localStorage.getItem('previous')) {
      this.startTimer(5);
      setTimeout(() => {
        this.router.navigate([window.localStorage.getItem('previous')]);
      }, 5000);
    }
    // TODO: for DEBUG purposes
    console.log('p', this.auth.token);
  }

  getName(): string {
    return this.auth.token ? this.auth.token.name : '';
  }

  startTimer(seconds: number): void {
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue += sec * 100 / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }
}
