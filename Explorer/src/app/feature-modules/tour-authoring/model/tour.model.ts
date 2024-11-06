import { KeyPoint } from "./key-point.model";
import { TourReview } from "./tour-review.model";
import { TransportInfo } from "./transportInfo.model";

export interface Tour {
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
    reviews:TourReview[];
    averageScore: number;
    reviewStatus?:number;    
  }