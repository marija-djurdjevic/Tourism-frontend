export interface Tour {
    id?: number; // Ako koristiš auto-increment u bazi, ovo može biti opcionalno
    authorId?: number; // Ako je obavezno, dodaj ga
    name: string;
    description: string;
    difficulty: number; // Trebalo bi da odgovara enum vrednostima
    tags: string;
    status: number; // Ako želiš postaviti status, možeš ga dodati
    price: number;
  }