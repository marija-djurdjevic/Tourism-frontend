/*export interface Problem {
    id?: number;
    tourId: number;
    category : number;
    problemPriority: number;
    description: string;
    time?:string;
 
}*/
export interface Notification {
    content: string;
    recieverId: number;
    isRead: boolean;
}

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
    notifications: Notification[]; 
    details: Details; 
    comments: Comment[]; 
    status: number;
    deadline?: Date; 
}