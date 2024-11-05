// tour-session.model.ts
export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface TourSession {
    id: number;
    tourId: number;
    startTime: string;  
    endTime: string | null;  
    status: 'started' | 'completed' | 'abandoned';  
    initialLocation: Location;
  }
  