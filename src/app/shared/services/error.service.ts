import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackbarService: MatSnackBar) {
  }

  errorSnackbar(errorResponse: HttpErrorResponse): void {
    if (errorResponse.statusText === 'Unknown Error') {
      this.snackbarService.open(errorResponse.statusText, 'Close', {
        duration: 3000
      });
    } else {
      this.snackbarService.open(errorResponse.error.error, 'Close', {
        duration: 3000
      });
    }
  }
}
