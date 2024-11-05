import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchByDistance } from './model/search-by-distance.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from '../tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  searchTours(searchByDistance: SearchByDistance): Observable<Tour[]> {
    return this.http.post<Tour[]>(environment.apiHost + 'tourist/tour/search', searchByDistance);
  }
}
