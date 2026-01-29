
export type Uputnica = {
  id: number;
  pacijentId: number;
  doktorId: number;
  dijagnoza: string;
  opis: string;
  upucujeSe: string;
  datumIzdavanja: string;

  pacijent?: {
    id: number;
    ime: string;
    prezime: string;
  };

  doktor?: {
    id: number;
    ime: string;
    prezime: string;
  };
}

export type UputnicaDto = {
  dijagnoza: string;
  opis: string;
  upucujeSe: string;
  doktorId: number; 
}
