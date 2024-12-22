import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchByDistance } from './model/search-by-distance.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from '../tour-authoring/model/tour.model';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  searchTours(searchByDistance: SearchByDistance): Observable<Tour[]> {
    return this.http.post<Tour[]>(environment.apiHost + 'tourist/tour/search', searchByDistance).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
}
