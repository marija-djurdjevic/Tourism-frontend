export enum NotificationType {
    TourProblem = 0,
    PublicRequest = 1,
    TourRefund = 2,
    GroupCancelation = 3
}

export interface Notification {
    id: number;
    content: string;
    type: NotificationType;
    referenceId: number;
    recieverId: number;
    isRead: boolean;
}
