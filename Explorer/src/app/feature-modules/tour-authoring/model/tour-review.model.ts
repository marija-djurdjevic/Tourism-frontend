import { Observable } from "rxjs";

export interface TourReview {
    id?: number;
    comment?: string;
    grade?: number;
    tourId?: number;
    userId?: number;
    username: string;
    images : string;
    tourVisitDate: Date;
    tourReviewDate: Date;
    tourProgressPercentage:number;
    reviewImages?:string[];
}
