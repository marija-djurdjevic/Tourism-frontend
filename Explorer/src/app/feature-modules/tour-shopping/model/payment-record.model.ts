export interface PaymentRecord {
    id?: number;
    touristId: number;
    bundleId: number;
    purchasedTime: Date;
    price: number;
}