import { KeyPoint } from "../../tour-authoring/model/key-point.model";
import { TransportInfo } from "../../tour-authoring/model/transportInfo.model";

export interface TourSearch {
    id?: number; 
    authorId?: number; 
    name: string;
    description: string;
    difficulty: number; 
    tags: string;
    status: number; 
    price: number;
    publishedAt?: Date;   
    archivedAt?: Date;   
    transportInfo: TransportInfo; 
    keyPoints: KeyPoint[];  
    averageScore: number;       
  }