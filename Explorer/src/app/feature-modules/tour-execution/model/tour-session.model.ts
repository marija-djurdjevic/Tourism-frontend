// tour-session.model.ts
export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface CompletedKeyPoint {
    keyPointId: number;
    completedAt: any;
  }
  export interface TourSession {
    id: number;
    tourId: number;
    startTime: string;  
    endTime: string | null;  
    status: 'started' | 'completed' | 'abandoned';  
    initialLocation: Location;
  }
  