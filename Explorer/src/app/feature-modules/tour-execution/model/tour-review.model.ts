export interface TourReview {
    id?: number;
    comment?: string;
    grade?: number;
    tourId?: number;
    userId?: number;
    images : string;
    tourVisitDate: Date;
}
