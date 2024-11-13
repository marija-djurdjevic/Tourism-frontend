import { Vote } from "./Vote";

export interface Blog {
    id?: number; 
    authorId: number; 
    votes: Vote[];
    title: string;
    description: string;
    creationDate: Date;
    image: string;
    status: number; 
}