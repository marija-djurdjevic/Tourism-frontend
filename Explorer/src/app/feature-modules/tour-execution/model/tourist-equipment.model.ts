import { Equipment } from "../../administration/model/equipment.model";

export interface TouristEquipment{
    id: number;
    touristId: number;
    equipmentId: number;
    equipment: Equipment;
}