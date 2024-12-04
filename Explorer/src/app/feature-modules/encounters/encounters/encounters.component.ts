import { Component, OnInit, OnDestroy } from '@angular/core';
import { EncounterService } from '../encounter.service'; 
import { Encounter } from '../../encounters/model/encounter.model'; 
import * as L from 'leaflet';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.css']
})
export class EncountersComponent implements OnInit, OnDestroy {
  encounters: Encounter[] = []; 
  private map: L.Map; 

  constructor(private encounterService: EncounterService) {}

  ngOnInit(): void {
    this.loadEncounters();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); 
    }
  }


  loadEncounters(): void {
    this.encounterService.getEncounters().subscribe((data) => {
      this.encounters = data.results.filter(encounter => encounter.status === 1);
      this.initializeMap();
    });
  }

    initializeMap(): void {
      const mapElement = document.getElementById('map'); 
      if (mapElement && !this.map) {
        this.map = L.map(mapElement).setView([45.2671, 19.8335], 13);  
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    
       
        const customIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', 
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', 
          shadowSize: [41, 41]
        });
    
        
        this.encounters.forEach(encounter => {
          if (encounter.coordinates.latitude && encounter.coordinates.longitude) {
            const marker = L.marker([encounter.coordinates.latitude, encounter.coordinates.longitude], {
              icon: customIcon 
            })
            .addTo(this.map)
            .bindPopup(`
              <div style="background-color: #f9f9e5; border-radius: 15px; padding: 20px; font-family: "Helvetica Neue", sans-serif; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); max-width: 300px; min-width: 250px; font-size: 16px;">
                <h3 style="font-size: 18px; color: #333; font-weight: bold; text-align: center; margin: 0 0 10px 0;">${encounter.name}</h3>
                <div style="font-size: 16px; color: #555; margin-bottom: 15px; text-align: center; line-height: 1.4;">${encounter.description}</div>
                <div style="font-size: 18px; font-weight: bold; text-align: center; color: #28a745;">
                  XP: ${encounter.xp}
                </div>
              </div>
            `); 
          }
        });
      }
    }
    


}
