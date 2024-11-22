export interface Comment {
    content: string;
    type: number;
    senderId: number;
    sentTime: string;
}

export interface Details {
    category: number;
    problemPriority: number;
    explanation: string;
    time: string; 
}

export interface Problem {
    id?: number; 
    touristId: number;
    tourId: number;
    details: Details; 
    comments: Comment[]; 
    status: number;
    deadline?: Date; 
}