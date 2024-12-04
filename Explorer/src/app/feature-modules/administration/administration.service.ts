import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Account } from './model/account.model';
import { Encounter } from '../encounters/model/encounter.model';
// import { Encounter } from './model/encounter.model';
import { Wallet } from '../tour-shopping/model/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAccount(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/account')
  }

  blockAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(environment.apiHost + 'administration/account/block-account', account);
  }

  addEncounter(encounter: Encounter) : Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + 'administrator/encounter', encounter);
  }

  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'administrator/encounter');
  }

  deleteEncounter(encounterId: number | undefined): Observable<void> {
    console.log('Deleting encounter with ID: ' + encounterId);
    return this.http.delete<void>(`${environment.apiHost}administrator/encounter/${encounterId}`);
  }

  updateEncounter(id: number | undefined, encounter: Encounter): Observable<Encounter> {
    return this.http.put<Encounter>(`${environment.apiHost}administrator/encounter/${id}`, encounter);
  }

  getAllWallets(): Observable<PagedResults<Wallet>> {
    return this.http.get<PagedResults<Wallet>>(environment.apiHost + 'administrator/wallet')
  }

  updateWallet(updatedWallet: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(environment.apiHost + 'administrator/wallet', updatedWallet)
  }

}
