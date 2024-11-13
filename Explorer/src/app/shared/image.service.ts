import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiHost;
  private controllerPath="";

  constructor(private http: HttpClient) {}

  setControllerPath(path:string):void{
    if(this.controllerPath==""){
      this.controllerPath=path;
      this.apiUrl=this.apiUrl+this.controllerPath;
    }else if(this.controllerPath!==path){
      this.controllerPath=path;
      this.apiUrl = environment.apiHost;
      this.apiUrl=this.apiUrl+this.controllerPath;
    }
  }

  uploadImage(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<number>(this.apiUrl, formData);
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }
}
