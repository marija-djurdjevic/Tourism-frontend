export enum NotificationType {
    TourProblem = 0,
    TourRefund = 1,
}

export interface Notification {
    id: number;
    content: string;
    notificationType: number;
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}
