export interface Comment {
    id?: number;
    authorId: number;
    text: string;
    creationDate: Date;
    editDate: Date;
    blogId: number;
    username: string;
}