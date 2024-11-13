// tour-session.model.ts
export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface CompletedKeyPoint {
    id: number;
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
  