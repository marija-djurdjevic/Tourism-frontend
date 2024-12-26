import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/env/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiHost;
  private controllerPath = "";

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  setControllerPath(path: string): void {
    if (this.controllerPath == "") {
      this.controllerPath = path;
      this.apiUrl = this.apiUrl + this.controllerPath;
    } else if (this.controllerPath !== path) {
      this.controllerPath = path;
      this.apiUrl = environment.apiHost;
      this.apiUrl = this.apiUrl + this.controllerPath;
    }
  }

  uploadImage(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<number>(this.apiUrl, formData).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status != 404) {
          this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        }
        return throwError(() => error);
      })
    );
  }
}
