export interface Notification {
    id: number;
    content: string;
    type: number;     
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}