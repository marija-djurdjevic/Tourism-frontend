import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter } from '../encounters/model/encounter.model'; // Putanja do modela



@Injectable({
  providedIn: 'root'
})
export class EncounterService {

  constructor(private http: HttpClient) { }

  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'tourist/encounter');
  }

  getAllEncountersForAdmin(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'administration/encounter');
  }

  addEncounter(encounter : Encounter,user:string): Observable<Encounter>{
    return this.http.post<Encounter>(environment.apiHost +user+'/encounter', encounter)
  }

  activateEncounter(encounterId:number): Observable<Encounter>{
    return this.http.put<Encounter>(environment.apiHost +'administration/encounter/activate/'+encounterId,{} )
  }
}
