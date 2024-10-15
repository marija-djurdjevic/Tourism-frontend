import { Person } from "src/app/infrastructure/auth/model/person.model";

export interface UserRating{
    rating: number
    comment: string
    createdAt: Date
    userId: number
    person?: Person;
}