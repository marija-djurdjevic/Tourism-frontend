import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { environment } from 'src/env/environment';
import { OrderItem } from './model/order-item.model';
import { endOfISOWeek } from 'date-fns';
import { ShoppingCart } from './model/shopping-cart.model';
import { KeyPoint } from '../tour-authoring/model/key-point.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Wallet } from './model/wallet.model';
import { PaymentRecord } from './model/payment-record.model';
import { Bundle } from './model/bundle.model';
import { Coupon } from './model/coupon.model';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class TourShoppingService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getTours(): Observable<Array<Tour>> {
    return this.http.get<Array<Tour>>(environment.apiHost + 'tourist/tour').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  checkout(items: OrderItem[]): Observable<ShoppingCart> {
    console.log("CHECKOUTING", items);
    return this.http.post<ShoppingCart>(`${environment.apiHost}tourist/shopping/checkout`, items).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getPurchasedTours(): Observable<Array<Tour>> {
    return this.http.get<Array<Tour>>(environment.apiHost + 'tourist/shopping/purchased').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getKeyPoints(): Observable<KeyPoint[]> {
    return this.http.get<{ results: KeyPoint[] }>(environment.apiHost + "tourist/tour/keyPoints").pipe(
      map(response => response.results), // Uzmi samo niz iz objekta
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(environment.apiHost + "tourist/wallet/balance").pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  updateWallet(wallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${environment.apiHost}tourist/wallet/update`, wallet).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getCouponsByAuthorId(id: number): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(environment.apiHost + "author/coupon/" + id).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(environment.apiHost + "author/coupon/", coupon).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  deleteCoupon(id: number): Observable<Coupon> {
    return this.http.delete<Coupon>(environment.apiHost + 'author/coupon/' + id).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(environment.apiHost + 'author/coupon/' + coupon.id, coupon).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getCouponByCode(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(environment.apiHost + "tourist/coupon/" + code).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  refundTour(tourId: number): Observable<Tour> {
    return this.http.post<Tour>(`${environment.apiHost}tourist/shopping/refund`, tourId).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getRefundedTour(referenceId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiHost}tourist/shopping/refund/${referenceId}`).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getPaymentRecords(touristId: number): Observable<PaymentRecord[]> {
    const params = new HttpParams().set('touristId', touristId.toString()); // Set the query param
    return this.http.get<PaymentRecord[]>(environment.apiHost + 'tourist/shopping/payments', { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getPurchasedBundles(touristId: number): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(environment.apiHost + 'tourist/shopping/bundle/purchased/' + touristId).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  purchaseBundle(bundle: Bundle, touristId: number): Observable<PaymentRecord> {
    const params = new HttpParams().set('touristId', touristId.toString()); // Set the query param
    return this.http.post<PaymentRecord>(environment.apiHost + 'tourist/shopping/bundle/purchase', bundle, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
}
