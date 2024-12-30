import { Encounter } from '../../encounters/model/encounter.model';

export interface KeyPoint {
    id?: number;  
    tourIds: number[];  
    name: string;
    description: string;
    storyId?: number;
    imagePath: string;
    latitude: number; 
    longitude: number;
    status: number;
    encounter?: Encounter;
  }
  