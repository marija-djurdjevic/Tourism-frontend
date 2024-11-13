import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ImageComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule
  ],
  exports: [
    ImageComponent, MapComponent
  ],
  
})
export class SharedModule { }
