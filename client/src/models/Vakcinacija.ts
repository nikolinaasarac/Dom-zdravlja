export type Vakcinacija = {
  id: number;
  nazivVakcine: string;
  datumPrimanja: string; 
  doza: number;
  napomena?: string;
  pacijentIme: string;
  pacijentPrezime: string;
};