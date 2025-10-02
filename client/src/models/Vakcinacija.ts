export type Vakcinacija = {
  id: number;
  nazivVakcine: string;
  datumPrimanja: string; // DateOnly u backendu dolazi kao string (npr. "2025-09-25")
  doza: number;
  napomena?: string;
  pacijentIme: string;
  pacijentPrezime: string;
};