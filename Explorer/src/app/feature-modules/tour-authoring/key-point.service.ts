import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { KeyPoint } from './model/key-point.model';
import { environment } from 'src/env/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class KeyPointService {

  private baseUrl = `${environment.apiHost}author/keyPoint`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getKeyPoints(): Observable<KeyPoint[]> {
    return this.http.get<{ results: KeyPoint[] }>(this.baseUrl).pipe(
      map(response => response.results),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.post<KeyPoint>(this.baseUrl, keyPoint).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addTourToKeyPoint(keyPoint: KeyPoint, additionalTourId: number): Observable<KeyPoint> {
    const url = `${this.baseUrl}/${keyPoint.id}?id=${additionalTourId}`;
    return this.http.put<KeyPoint>(url, keyPoint).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  deleteKeyPoint(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateKeyPoint(id: number, updatedKeyPoint: KeyPoint): Observable<KeyPoint> {
    const url = `${this.baseUrl}/${id}/update`;
    return this.http.put<KeyPoint>(url, updatedKeyPoint).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

}
