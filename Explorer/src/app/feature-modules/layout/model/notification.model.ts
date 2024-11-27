export enum NotificationType {
    TourProblem = 0,
    TourRefund = 1,
}

export interface Notification {
    id: number;
    content: string;
    type: NotificationType; // Use the enum here
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}
