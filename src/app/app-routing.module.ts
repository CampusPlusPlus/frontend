import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LevelNavigatorComponent } from './level-navigator/level-navigator.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'discipline' },
  { path: 'login', component: LoginComponent },
  { matcher: (segments: UrlSegment[]) => {
      console.log('segments', segments);
      return null;
    }, component: LevelNavigatorComponent },
  { path: 'discipline/:discipline/:studycourse/:lecture/:file', component: LevelNavigatorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
