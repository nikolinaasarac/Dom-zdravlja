export type ZahtjevZaAnalizu = {
  id: number;
  pacijentId: number;
  pacijentIme: string;
  pacijentPrezime: string;

  doktorId: number;
  doktorIme: string;
  doktorPrezime: string;

  tehnicarId?: number;
  tehnicarIme?: string | null;
  tehnicarPrezime?: string | null;

  opis: string;
  status: string;
  datumZahtjeva: string; 
};
