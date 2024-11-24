export interface PublishRequest {
    id?: number;
    authorId: number;
    adminId?: number;
    entityId: number;
    status: number;
    type: number;  
    name?:string;
    latitude?:number;
    longitude?:number;
    description?:string;
    imagePath?:string;
    authName? : string;
}
