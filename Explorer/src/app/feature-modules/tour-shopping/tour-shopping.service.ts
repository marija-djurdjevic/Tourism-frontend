import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { environment } from 'src/env/environment';
import { OrderItem } from './model/order-item.model';
import { endOfISOWeek } from 'date-fns';
import { ShoppingCart } from './model/shopping-cart.model';
import { KeyPoint } from '../tour-authoring/model/key-point.model';
import { map } from 'rxjs/operators';
import { Wallet } from './model/wallet.model';
import { PaymentRecord } from './model/payment-record.model';
import { Bundle } from './model/bundle.model';
import { Coupon } from './model/coupon.model';


@Injectable({
  providedIn: 'root'
})
export class TourShoppingService {

  constructor(private http: HttpClient) { }

  getTours(): Observable<Array<Tour>> {
    return this.http.get<Array<Tour>>(environment.apiHost + 'tourist/tour')
  }

  checkout(items: OrderItem[]): Observable<ShoppingCart> {
    console.log("CHECKOUTING", items);
    return this.http.post<ShoppingCart>(`${environment.apiHost}tourist/shopping/checkout`, items)
  }

  getPurchasedTours(): Observable<Array<Tour>> {
    return this.http.get<Array<Tour>>(environment.apiHost + 'tourist/shopping/purchased')
  }

  getKeyPoints(): Observable<KeyPoint[]> {
    return this.http.get<{ results: KeyPoint[] }>(environment.apiHost + "tourist/tour/keyPoints").pipe(
      map(response => response.results) // Uzmi samo niz iz objekta
    );
  }

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(environment.apiHost + "tourist/wallet/balance")
  }


  updateWallet(wallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${environment.apiHost}tourist/wallet/update`, wallet);
  }

  getCouponsByAuthorId(id: number): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(environment.apiHost + "author/coupon/" + id)
  }

  createCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(environment.apiHost + "author/coupon/", coupon);
  }

  deleteCoupon(id: number): Observable<Coupon> {
    return this.http.delete<Coupon>(environment.apiHost + 'author/coupon/' + id);
  }

  updateCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(environment.apiHost + 'author/coupon/' + coupon.id, coupon);
  }

  getCouponByCode(code: string): Observable<Coupon>{
    return this.http.get<Coupon>(environment.apiHost + "tourist/coupon/" + code)
  }

  refundTour(tourId: number): Observable<Tour> {
    return this.http.post<Tour>(`${environment.apiHost}tourist/shopping/refund`, tourId)
  }

  getRefundedTour(referenceId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiHost}tourist/shopping/refund/${referenceId}`);
  }

  getPaymentRecords(touristId: number): Observable<PaymentRecord[]> {
    const params = new HttpParams().set('touristId', touristId.toString()); // Set the query param
    return this.http.get<PaymentRecord[]>(environment.apiHost + 'tourist/shopping/payments', { params });
  }

  getPurchasedBundles(touristId: number): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(environment.apiHost + 'tourist/shopping/bundle/purchased/' + touristId);
  }

  purchaseBundle(bundle: Bundle, touristId: number): Observable<PaymentRecord> {
    const params = new HttpParams().set('touristId', touristId.toString()); // Set the query param
    return this.http.post<PaymentRecord>(environment.apiHost + 'tourist/shopping/bundle/purchase', bundle, { params });
  }
}
