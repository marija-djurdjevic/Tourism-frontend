import { Coordinates } from "./coordinates.model";

export interface Encounter {
	id: number;
	userId: number; 
	keyPointId: number;
	name: string;
	description: string; 
	xp: number; 
	coordinates: Coordinates;
	status: number;
	type: number;
	creator: number;
	
	range?: number;
	touristNumber?: number;
	imagePath?: string;
}