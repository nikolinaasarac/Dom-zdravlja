export type Pregled = {
  id: number;
  datumPregleda: string; 
  vrstaPregleda: string;
  opisSimptoma?: string;
  dijagnoza?: string;
  terapija?: string;
  napomena?: string;
  status: string; 

  pacijentIme: string;
  pacijentPrezime: string;

  doktorIme?: string;
  doktorPrezime?: string;
};
