import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyPoint } from './model/key-point.model'; 
import { environment } from 'src/env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeyPointService {

  private baseUrl = `${environment.apiHost}author/keyPoint`;

  constructor(private http: HttpClient) { }

  getKeyPoints(): Observable<KeyPoint[]> {
    return this.http.get<{ results: KeyPoint[] }>(this.baseUrl).pipe(
      map(response => response.results) 
    );
  }

  addKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.post<KeyPoint>(this.baseUrl, keyPoint);
  }

  addTourToKeyPoint(keyPoint: KeyPoint, additionalTourId: number): Observable<KeyPoint> {
    const url = `${this.baseUrl}/${keyPoint.id}?id=${additionalTourId}`;
    return this.http.put<KeyPoint>(url, keyPoint);
  }

  deleteKeyPoint(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateKeyPoint(id: number, updatedKeyPoint: KeyPoint): Observable<KeyPoint> {
    const url = `${this.baseUrl}/${id}/update`; 
    return this.http.put<KeyPoint>(url, updatedKeyPoint);
  }
  
}
