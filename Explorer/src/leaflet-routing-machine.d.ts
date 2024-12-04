import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface RoutingControlOptions {
      createMarker?: (i: number, waypoint: Waypoint, n: number) => L.Marker | null;
    }
  }
}
