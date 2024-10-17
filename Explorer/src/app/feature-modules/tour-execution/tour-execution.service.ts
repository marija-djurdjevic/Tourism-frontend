import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResult } from 'src/app/shared/shared.module';
import { TouristEquipment } from './model/tourist-equipment.model';
import { Observable } from 'rxjs';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getTouristEquipment(): Observable<PagedResult<TouristEquipment>>{

     // Dodaj odgovarajući token
    
    return this.http.get<PagedResult<TouristEquipment>>('https://localhost:44333/api/tourist/touristEquipment');
  }

  getEquipment(): Observable<PagedResult<Equipment>>{

    // Dodaj odgovarajući token
   
   return this.http.get<PagedResult<Equipment>>('https://localhost:44333/api/administration/equipment');
 }

 delete(touristEquipment: TouristEquipment): Observable<TouristEquipment>{

  // Dodaj odgovarajući token
 
 return this.http.delete<TouristEquipment>('https://localhost:44333/api/tourist/touristEquipment/'+ touristEquipment.id);
}

add(touristEquipment: TouristEquipment): Observable<TouristEquipment>{

  // Dodaj odgovarajući token
 
 return this.http.post<TouristEquipment>('https://localhost:44333/api/tourist/touristEquipment', touristEquipment);
}
}
