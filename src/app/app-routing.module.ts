import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { LoginComponent } from './login/login.component';
import {UploadFileComponent} from './upload-file/upload-file.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HelloWorldComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadFileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
