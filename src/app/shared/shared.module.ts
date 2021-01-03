import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellComponent} from './shell/shell.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {LayoutModule} from '@angular/cdk/layout';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './services/in-memory-data.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {HttpClientModule} from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';

const modules = [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatGridListModule,
  ReactiveFormsModule,
  MatAutocompleteModule,
  HttpClientModule,
];


@NgModule({
  declarations: [ShellComponent],
  imports: [
    ...modules,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  exports: [
    ...modules,
    ShellComponent
  ]
})
export class SharedModule {
}
