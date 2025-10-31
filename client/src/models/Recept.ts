export type Recept = {
  id: number;
  nazivLijeka: string;
  kolicina: string;
  nacinUzimanja: string;
  napomena?: string;
  datumIzdavanja: string;
};

export type ReceptDto = {
  nazivLijeka: string;
  kolicina: string;
  nacinUzimanja: string;
  napomena?: string;
}
