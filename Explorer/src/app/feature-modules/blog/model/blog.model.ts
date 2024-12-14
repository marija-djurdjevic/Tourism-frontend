import { Vote } from "./vote";

export interface Blog {
    id?: number; 
    authorId: number; 
    votes: Vote[];
    title: string;
    description: string;
    creationDate: Date;
    imageId?: number;
    image?: string;
    status: number; 
}