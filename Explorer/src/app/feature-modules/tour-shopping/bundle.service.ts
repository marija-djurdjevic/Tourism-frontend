import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/env/environment";
import { Bundle } from "./model/bundle.model";

@Injectable({
    providedIn: 'root'
})
export class BundleService {

    constructor(private http: HttpClient) { }

    getAuthorBundles(authorId: number): Observable<Bundle[]> {
        return this.http.get<Bundle[]>(environment.apiHost + 'author/bundle/' + authorId);
    }

    createBundle(bundle: Bundle): Observable<Bundle> {
        return this.http.post<Bundle>(environment.apiHost + 'author/bundle', bundle);
    }

    updateBundleStatus(bundle: Bundle): Observable<Bundle> {
        return this.http.put<Bundle>(`${environment.apiHost}author/bundle`, bundle);
    }
}