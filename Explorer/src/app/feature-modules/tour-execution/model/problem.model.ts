export interface Problem {
    id?: number;
    tourId: number;
    category : number;
    problemPriority: number;
    description: string;
    time?:string;
}