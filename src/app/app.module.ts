import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {FileUploadFormComponent} from './file-upload-form/file-upload-form.component';
import {AutocompleteFormComponent} from './file-upload-form/autocomplete-form/autocomplete-form.component';
import {UploadFormComponent} from './file-upload-form/upload-form/upload-form.component';
import {LevelNavigatorComponent} from './level-navigator/level-navigator.component';
import {FileDetailComponent} from './file-detail/file-detail.component';
import {LevelListComponent} from './level-navigator/level-list/level-list.component';
import {FileElementComponent} from './file-detail/file-element/file-element.component';
import {CommentComponent} from './comment/comment.component';
import {DialogAddGenericComponent} from './level-navigator/dialog-add-generic/dialog-add-generic.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {TagsComponent} from './tags/tags.component';
import {CreateLevelFormComponent} from './level-navigator/create-level-form/create-level-form.component';
import {CreateLevelLectureFormComponent} from './level-navigator/create-level-lecture-form/create-level-lecture-form.component';
import {DialogDeleteGenericComponent} from './level-navigator/dialog-delete-generic/dialog-delete-generic.component';
import {DialogConfirmationComponent} from './level-navigator/dialog-confirmation/dialog-confirmation.component';
import {RateComponent} from './file-detail/rate/rate.component';
import {CommentListComponent} from './comment/comment-list/comment-list.component';
import {CommentDetailComponent} from './comment/comment-list/comment-detail/comment-detail.component';
import {CommentWriterComponent} from './comment/comment-writer/comment-writer.component';
import {KeycloakComponent} from './keycloak/keycloak.component';
import {LogoutComponent} from './logout/logout.component';
import {EditTagsComponent} from './tags/edit-tags/edit-tags.component';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadFormComponent,
    AutocompleteFormComponent,
    LevelNavigatorComponent,
    FileDetailComponent,
    UploadFormComponent,
    LevelListComponent,
    FileElementComponent,
    CommentComponent,
    DialogAddGenericComponent,
    TagsComponent,
    CreateLevelFormComponent,
    CreateLevelLectureFormComponent,
    DialogDeleteGenericComponent,
    DialogConfirmationComponent,
    RateComponent,
    CommentListComponent,
    CommentDetailComponent,
    CommentWriterComponent,
    KeycloakComponent,
    LogoutComponent,
    EditTagsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
