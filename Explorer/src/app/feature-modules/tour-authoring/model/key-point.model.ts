import { Encounter } from '../../encounters/model/encounter.model';

export interface KeyPoint {
    id?: number;  
    tourId: number;  
    name: string;
    description: string;
    imagePath: string;
    latitude: number; 
    longitude: number;

    encounter?: Encounter;
  }
  