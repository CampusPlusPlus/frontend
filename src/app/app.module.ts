import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';
import { AutocompleteFormComponent } from './file-upload-form/autocomplete-form/autocomplete-form.component';
import { TagsFormComponent } from './file-upload-form/tags-form/tags-form.component';
import { UploadFormComponent } from './file-upload-form/upload-form/upload-form.component';
import { LevelNavigatorComponent } from './level-navigator/level-navigator.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { LevelListComponent } from './level-navigator/level-list/level-list.component';



@NgModule({
  declarations: [
    AppComponent,
    FileUploadFormComponent,
    AutocompleteFormComponent,
    LevelNavigatorComponent,
    FileDetailComponent,
    HelloWorldComponent,
    TagsFormComponent,
    UploadFormComponent,
    LevelListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
