import { TransportType } from './transportInfo.model'; // Pretpostavka da već imaš model za TransportInfo

export interface GroupTour {
  id?: number; // Opcioni ID (može ga generisati baza podataka)
  name: string;
  description: string;
  difficulty: number; // 0 = Easy, 1 = Medium, 2 = Hard
  tags: string[];
  price: number;
  touristNumber: number; // Broj turista
  startTime: Date; // Datum i vreme početka ture
  duration: number; // Trajanje u minutima
  transportInfo: {
    time: number; // Vreme putovanja u minutima
    distance: number; // Udaljenost u km ili metri (po potrebi)
    transport: TransportType; // Tip transporta
  };
  keyPoints: string[]; // Lista ključnih tačaka ture
  reviews: any[]; // Ostavljaš prostor za dodatak sistema ocenjivanja
}
