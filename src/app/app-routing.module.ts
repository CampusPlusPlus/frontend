import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LevelNavigatorComponent} from './level-navigator/level-navigator.component';
import {FileDetailComponent} from './file-detail/file-detail.component';
import {FileUploadFormComponent} from './file-upload-form/file-upload-form.component';
import {KeycloakComponent} from './keycloak/keycloak.component';
import {LogoutComponent} from './logout/logout.component';
import {EditTagsComponent} from './tags/edit-tags/edit-tags.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full', component: LevelNavigatorComponent },
  // { path: '', pathMatch: 'full', component: HelloWorldComponent },
  {path: '', pathMatch: 'full', redirectTo: 'discipline'},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'keycloack', component: KeycloakComponent},
  {path: 'upload', component: FileUploadFormComponent},
  {path: 'discipline', component: LevelNavigatorComponent},
  {path: 'discipline/:disciplineID', component: LevelNavigatorComponent},
  {path: 'discipline/:disciplineID/:studyCourseID', component: LevelNavigatorComponent},
  {path: 'discipline/:disciplineID/:studyCourseID/:curriculaID', component: LevelNavigatorComponent},
  {path: 'discipline/:disciplineID/:studyCourseID/:curriculaID/:lectureID', component: LevelNavigatorComponent},
  {path: 'discipline/:disciplineID/:studyCourseID/:curriculaID/:lectureID/:fileID', component: FileDetailComponent},
  {path: 'file/:fileID', component: FileDetailComponent},
  {path: 'editTags', component: EditTagsComponent},
  // {
  //   matcher: (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
  //     // console.log('segments', segments);
  //     // console.log('group', group);
  //     // console.log('route', route);
  //     if (segments.length === 0 || segments.length > 4) {
  //       return null;
  //     }
  //     if (segments[0].toString() !== 'discipline') {
  //       return null;
  //     }
  //     return { consumed: segments };
  //   }, component: LevelNavigatorComponent
  // },
  // {
  //   matcher: (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
  //     console.log('segments', segments);
  //     console.log('group', group);
  //     console.log('route', route);
  //     if (segments.length === 0 || segments.length > 5) {
  //       return null;
  //     }
  //     if (segments[0].toString() !== 'discipline') {
  //       return null;
  //     }
  //     return { consumed: segments };
  //   }, component: FileDetailComponent
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      enableTracing: false,
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
