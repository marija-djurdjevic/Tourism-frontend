import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "src/env/environment";
import { Bundle } from "./model/bundle.model";
import { Tour } from "../tour-authoring/model/tour.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Injectable({
    providedIn: 'root'
})
export class BundleService {

    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

    getAuthorBundles(authorId: number): Observable<Bundle[]> {
        return this.http.get<Bundle[]>(environment.apiHost + 'author/bundle/' + authorId).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    createBundle(bundle: Bundle): Observable<Bundle> {
        return this.http.post<Bundle>(environment.apiHost + 'author/bundle', bundle).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    updateBundleStatus(bundle: Bundle): Observable<Bundle> {
        return this.http.put<Bundle>(`${environment.apiHost}author/bundle`, bundle).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getBundleTours(authorId: number, bundleId: number): Observable<Tour[]> {
        return this.http.get<Tour[]>(`${environment.apiHost}author/bundle/${authorId}/${bundleId}`).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getAllBundles(): Observable<PagedResults<Bundle>> {
        return this.http.get<PagedResults<Bundle>>(environment.apiHost + 'author/bundle').pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }
}