import { TransportType } from './transportInfo.model'; 

export interface GroupTour {
  id?: number; 
  authorId?: number;
  name: string;
  description: string;
  difficulty: number; 
  tags: string[];
  price: number;
  touristNumber: number; 
  startTime: Date; 
  duration: number; 
  transportInfo: {
    time: number; 
    distance: number; 
    transport: TransportType; 
  };
  keyPoints: string[]; 
  reviews: any[]; 
}
