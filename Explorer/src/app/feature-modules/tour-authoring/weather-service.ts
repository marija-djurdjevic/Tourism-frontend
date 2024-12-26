import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.api-ninjas.com/v1/weather';
  private geocodingApiUrl = 'https://api.api-ninjas.com/v1/reversegeocoding';
  private apiKey = 'HTx7KnQrsKqkLFNHuzEnQw==rk4b4Us5x6ayEAjM'

  constructor(private http: HttpClient) {}

  // Fetch weather using latitude and longitude
  getWeatherByCoords(latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });
    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}`;
    
    console.log('Request URL:', url);
    console.log('Request Headers:', headers);
  
    return this.http.get(url, { headers });
  }

  getCityByCoords(latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });
    const url = `${this.geocodingApiUrl}?lat=${latitude}&lon=${longitude}`;
    return this.http.get(url, { headers });
  }
  
}
