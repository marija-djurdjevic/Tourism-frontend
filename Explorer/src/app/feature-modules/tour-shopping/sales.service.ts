import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Sale } from "./model/sale.model";
import { environment } from "src/env/environment";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

    getSales(): Observable<PagedResults<Sale>> {
        return this.http.get<PagedResults<Sale>>(environment.apiHost + 'author/sale').pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    createSale(sale: Sale): Observable<Sale> {
        console.log(sale)
        return this.http.post<Sale>(environment.apiHost + 'author/sale', sale).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    deleteSale(id: number): Observable<Sale> {
        return this.http.delete<Sale>(environment.apiHost + 'author/sale/' + id).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    updateSale(sale: Sale): Observable<Sale> {
        console.log("ID JE: " + sale.id)
        console.log(sale)
        return this.http.put<Sale>(environment.apiHost + 'author/sale/' + sale.id, sale).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }
}