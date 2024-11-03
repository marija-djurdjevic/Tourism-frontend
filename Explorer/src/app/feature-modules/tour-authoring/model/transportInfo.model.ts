export enum TransportType {
    Walk = 0,
    Car = 1,
    Bicycle = 2,
}

export interface TransportInfo {
    time: number;      
    distance: number;  
    transport: TransportType;
}