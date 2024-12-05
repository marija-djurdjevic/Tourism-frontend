export interface Coupon {
    id: number;  
    authorId: number;
    discountedTourId: number;
    tourName: string;
    expiryDate: string;
    allDiscounted: boolean;
    discount: number;
    code: string;
  }