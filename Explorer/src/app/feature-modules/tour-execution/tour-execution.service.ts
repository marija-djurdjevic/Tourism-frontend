import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResult } from 'src/app/shared/shared.module';
import { TouristEquipment } from './model/tourist-equipment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getTouristEquipment(): Observable<PagedResult<TouristEquipment>>{

     // Dodaj odgovarajući token
    
    return this.http.get<PagedResult<TouristEquipment>>('https://localhost:44333/api/tourist/touristEquipment');
  }
}
