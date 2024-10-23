export interface TourPreferences {
    id: number,
    touristId: number,
    difficulty?: number,
    walkingRating: number,
    cyclingRating: number,
    drivingRating: number,
    sailingRating: number,
    tags?: string[]
}