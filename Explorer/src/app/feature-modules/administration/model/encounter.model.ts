import { Coordinates } from "./coordinates.model";

export interface Encounter {
    id?: number;
    administratorId: number;
    name: string;
    description: string;
    xp: number;
    status: number;
    type: number;
    coordinates: Coordinates;

}