export interface TourReview {
    id?: number;
    comment?: number;
    grade?: number;
    tourId?: number;
    userId?: number;
    images : string;
    tourVisitDate: Date;
    tourReviewDate: Date;
}
