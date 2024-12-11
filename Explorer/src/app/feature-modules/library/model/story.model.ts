export interface Story {
    id?: number; 
    image?: string;
	imageId?: number;
    authorId?: number;
    bookId?:number;
    content:string;
    title:string;
    status?:string;
}