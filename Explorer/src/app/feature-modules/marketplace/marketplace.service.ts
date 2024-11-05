import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourSearch } from './model/tour-search.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  // searchTours(): Observable<TourSearch> {
  //   return this.http.post<TourSearch>(environment.apiHost + '/api/tourist/tour/search');
  // }
}
