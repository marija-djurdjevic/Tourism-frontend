import { Component, Input, OnInit } from '@angular/core';
import { TouristEquipment } from '../model/tourist-equipment.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from 'src/app/shared/shared.module';
import { Equipment } from '../../administration/model/equipment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-tourist-equipment',
  templateUrl: './tourist-equipment.component.html',
  styleUrls: ['./tourist-equipment.component.css']
})
export class TouristEquipmentComponent implements OnInit {

  user: User | undefined;

  touristEquipment: TouristEquipment[] = [];
  allTouristEquipment: TouristEquipment[] = [];
  selectedTouristEquipment: TouristEquipment;
  equipment: Equipment[] = [];
  @Input() touristId: number;
 // @Output() equipmentUpdated = new EventEmitter<null>();

  //constructor(private service: TourExecutionService) { }

    length: number;

  //@Input() userId: number;
  constructor(private service: TourExecutionService, private authService: AuthService) { }

  
    

    ngOnInit(): void {

      this.authService.user$.subscribe(user => {
        this.user = user;
  
        /*this.selectedTouristEquipment = {
          id: 0, 
          touristId: this.user.id,
          equipmentId: 0, 
          equipment
          
        };*/
        console.log(this.user.id);
        //if (this.user && this.user.id) {
         // this.selectedTouristEquipment.touristId = this.user.id;
          this.loadTouristEquipment(this.user.id);
          this.loadEquipments();
          this.loadAllEquipments();
        //}
        //this.idService.selectedId$.subscribe(id => this.id = id);

        //this.loadEquipments();
      });
      
      //this.loadEquipments();
      //this.loadAllEquipments();
    }

   

      loadTouristEquipment(touristId: number): void {
        this.service.getTouristEquipment(touristId).subscribe({
          next: (result: TouristEquipment[]) => {
            this.touristEquipment = result;
            //this.getAllTourEquipments();
          },
          error: () => {
          }
        })
      }

      

      loadAllEquipments(): void {
        this.service.getAllEquipment().subscribe({
          next: (result: PagedResult<TouristEquipment>) => {
            this.allTouristEquipment = result.results;
            console.log(this.equipment);
           // this.length=result.results.length;
            const lastItem = this.allTouristEquipment[this.allTouristEquipment.length - 1];
            console.log(lastItem);
            console.log(this.allTouristEquipment.length);
            this.length = lastItem.id;
            console.log(lastItem.id);
          },
          error: (err: any) =>{
            console.log(err)
          }
        })
      }

     
    

    Delete(touristEquipment: TouristEquipment){
       this.service.delete(touristEquipment).subscribe({
        next: (result: TouristEquipment) => {
          touristEquipment = result;
          console.log(this.touristEquipment);
          this.ngOnInit();
          
          
          
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }

    loadEquipments(): void {
      this.service.getEquipment().subscribe({
        next: (result: PagedResult<Equipment>) => {
          this.equipment = result.results;
          console.log(this.equipment);
         // this.length=result.results.length;
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }

    async add(equipment: Equipment): Promise<void> {
      var touristEquipment: TouristEquipment={
        id: this.length+1 || 0,
        equipmentId: equipment.id || 0,
        equipment: equipment || "",
        
        touristId: this.user?.id || 0
      } 

      const exists = this.allTouristEquipment.some(equipment => equipment.equipmentId === touristEquipment.equipmentId && equipment.touristId===touristEquipment.touristId);

      if (exists) {
        console.log(`Tu opremu vec posjedujete.`);
        alert(`Tu opremu vec posjedujete.`);
        return; // Prekida funkciju ako već postoji
      }

      this.service.add(touristEquipment).subscribe({
        next: (result: TouristEquipment) => {
          touristEquipment = result;
          this.ngOnInit();
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }


    
}
