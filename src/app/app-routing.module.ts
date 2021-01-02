import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LevelNavigatorComponent } from './level-navigator/level-navigator.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import {FileUploadFormComponent} from './file-upload-form/file-upload-form.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'discipline' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: FileUploadFormComponent },
  {
    matcher: (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
      console.log('segments', segments);
      console.log('group', group);
      console.log('route', route);
      if (segments.length === 0 || segments.length > 4) {
        return null;
      }
      if (segments[0].toString() !== 'discipline') {
        return null;
      }
      return { consumed: segments };
    }, component: LevelNavigatorComponent
  },
  {
    matcher: (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
      console.log('segments', segments);
      console.log('group', group);
      console.log('route', route);
      if (segments.length === 0 || segments.length > 5) {
        return null;
      }
      if (segments[0].toString() !== 'discipline') {
        return null;
      }
      return { consumed: segments };
    }, component: FileDetailComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
