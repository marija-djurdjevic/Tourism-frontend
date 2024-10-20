import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';
import { MapComponent } from './map/map.component';



@NgModule({
  declarations: [
    ImageComponent,
    MapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageComponent, MapComponent
  ],
  
})
export class SharedModule { }
