import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter } from '../encounters/model/encounter.model'; // Putanja do modela
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';



@Injectable({
  providedIn: 'root'
})
export class EncounterService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'tourist/encounter').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getAllEncountersForAdmin(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'administration/encounter').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addEncounter(encounter: Encounter, user: string): Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + user + '/encounter', encounter).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  activateEncounter(encounterId: number): Observable<Encounter> {
    return this.http.put<Encounter>(environment.apiHost + 'administration/encounter/activate/' + encounterId, {}).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
}
