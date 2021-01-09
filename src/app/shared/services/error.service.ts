import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackbarService: MatSnackBar) {
  }

  errorHTTPSnackbar(errorResponse: HttpErrorResponse): void {
    if (errorResponse.statusText === 'Unknown Error') {
      this.snackbarService.open(errorResponse.statusText, 'Close', {
        duration: 3000
      });
    } else if (errorResponse.error.error === 'Unauthorized') {
      this.snackbarService.open('You are not authorized to do that, login or register',
        'Close', {
          duration: 5000
        });
    } else {
      this.snackbarService.open(errorResponse.error.error, 'Close', {
        duration: 3000
      });
    }
  }

  errorSnackbar(error: string): void {
    this.snackbarService.open(error, 'Close', {
      duration: 5000
    });
  }

  errorUnauthorized(): void {
    this.errorSnackbar('You are not authorized to do this.');
  }

}
