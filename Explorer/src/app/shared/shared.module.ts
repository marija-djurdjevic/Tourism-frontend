import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    ImageComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ImageComponent, MapComponent
  ],
  
})
export class SharedModule { }

export interface PagedResult<T>{
  results: T[];
  totalCount: number;

}
