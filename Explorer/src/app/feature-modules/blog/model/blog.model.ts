export interface Blog {
    // id?: number; 
    authorId: number; 
    title: string;
    description: string;
    creationDate: Date;
    image: string;
    status: number; 
}