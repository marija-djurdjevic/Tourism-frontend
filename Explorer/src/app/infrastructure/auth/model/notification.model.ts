export interface Notification {
    content: string;
    notificationType: string;     
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}