import { HttpClient } from '@angular/common/http';
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
    return this.http.post<ShoppingCart>(`${environment.apiHost}tourist/shopping/checkout`,items)
  }
  
  getPurchasedTours():Observable<Array<Tour>> {
    return this.http.get<Array<Tour>>(environment.apiHost + 'tourist/shopping/purchased')
  }

  getKeyPoints(): Observable<KeyPoint[]> {
    return this.http.get<{ results: KeyPoint[] }>(environment.apiHost + "tourist/tour/keyPoints").pipe(
      map(response => response.results) // Uzmi samo niz iz objekta
    );
  }
  
}
