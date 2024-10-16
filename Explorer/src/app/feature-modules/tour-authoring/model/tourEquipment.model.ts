import { Equipment } from "../../administration/model/equipment.model";

export interface TourEquipment{
    equipment: Equipment,
    id:number,
    tourId:number,
    equipmentId:number
}