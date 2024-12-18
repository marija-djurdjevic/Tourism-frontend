import { KeyPoint } from './key-point.model';
import { DifficultyStatus } from './tour.model';
import { TransportType } from './transportInfo.model'; 

export interface GroupTour {
  id?: number; 
  authorId?: number;
  name: string;
  description: string;
  difficulty: DifficultyStatus; 
  tags: string[];
  price: number;
  status: number;
  touristNumber: number; 
  startTime: Date; 
  progress: number;
  duration: number; 
  averageScore: number;
  publishedAt?: Date;   
  archivedAt?: Date;  
  reviewStatus?:number;
  transportInfo: {
    time: number; 
    distance: number; 
    transport: TransportType; 
  };
  keyPoints: KeyPoint[]; 
  reviews: any[]; 
  isGroupTour: boolean;
}

export enum ProgressStatus {
  Scheduled = 0,
  InProgress = 1,
  Finished = 2,
  Canceled = 3
}
