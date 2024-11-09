export interface Notification {
    id: number;
    content: string;
    notificationType: string;     
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}