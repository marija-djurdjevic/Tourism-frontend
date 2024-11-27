export enum NotificationType {
    TourProblem = 0,
    PublicRequest = 1,
    TourRefund = 2,
}

export interface Notification {
    id: number;
    content: string;
    notificationType: number;
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}
