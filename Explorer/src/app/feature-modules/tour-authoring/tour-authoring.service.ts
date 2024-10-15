import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourEquipment } from './model/tourEquipment.model';
import { Object } from './model/object.model';
import { Tour } from './model/tour.model'
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http:HttpClient) { }

  getObject():Observable<PagedResults<Object>>{
    return this.http.get<PagedResults<Object>>('https://localhost:44333/api/author/object');
  }


  addObject(object:Object):Observable<Object>{
    object.category=Number(object.category)
    console.log(object)
    return this.http.post<Object>('https://localhost:44333/api/author/object',object);
  }


  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tour')
  }

  addTour(tour: Tour): Observable<Tour> {
    console.log('Sending tour data to API:', tour); // Dodaj ovu liniju
    return this.http.post<Tour>(environment.apiHost + 'administration/tour', tour);
  }
  getTourEquipment(tourId: number): Observable<TourEquipment[]> {
    return this.http.get<TourEquipment[]>(environment.apiHost + 'tourEquipment/byTourId', {
      params: {
        tourId: tourId.toString(), // Pretvorite brojeve u stringove jer query parametri moraju biti stringovi
        page: "1",
        pageSize: "10"
      }
    })
  }

  getAllTourEquipments(): Observable<TourEquipment[]> {
    return this.http.get<TourEquipment[]>(environment.apiHost + 'tourEquipment/allTourEquipments', {
      params: {
        page: "1",
        pageSize: "10"
      }
    })
  }

  deleteTourEquipment(id: number): Observable<TourEquipment> {
    return this.http.delete<TourEquipment>(environment.apiHost + 'tourEquipment/' + id);
  }

  addTourEquipment(tourEquipment: TourEquipment): Observable<TourEquipment> {
    return this.http.post<TourEquipment>(environment.apiHost + 'tourEquipment', tourEquipment);
  }
}
