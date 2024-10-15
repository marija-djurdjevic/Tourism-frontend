import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Object } from '../model/object.model'

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent {

  
  selectedFile: File | null = null;
  previewImage: string | null = null

  constructor(private service:TourAuthoringService){}

    objectForm=new FormGroup({
    name:new FormControl('',[Validators.required]),
    description:new FormControl('',[Validators.required]),
    category:new FormControl(0,[Validators.required]),
    image:new FormControl('',[Validators.required])


  })


  onFileSelected(event: any): void {
    const file = event.target.files[0]; 
    if (file) {
       
        const imagePath = 'assets/images/' + file.name; 

        
        const reader = new FileReader();
        reader.onload = (e: any) => {
         
            this.objectForm.patchValue({ image: imagePath });
            
            this.previewImage = e.target.result; 
        };
        reader.readAsDataURL(file); 
    }
}





addObject(): void {
  if (this.objectForm.valid) {
    const object: Object = {
      name: this.objectForm.value.name || "",
      description: this.objectForm.value.description || "",
      category: this.objectForm.value.category || 0,
      image: this.objectForm.value.image || ""
    };

   
    this.service.addObject(object).subscribe({
      next: () => {
        alert('Objekat uspešno kreiran!'); 
        this.objectForm.reset(); 
        this.previewImage = null; 
      },
      error: () => {
        alert('Došlo je do greške prilikom kreiranja objekta.'); 
      }
    });
  } else {
   
    alert('Molimo vas da popunite sva polja ispravno.');
  }
}


}
