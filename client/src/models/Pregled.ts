export type Pregled = {
  id: number;
  datumPregleda: string; // ISO format (npr. "2025-10-20T09:00:00")
  vrstaPregleda: string;
  opisSimptoma?: string;
  dijagnoza?: string;
  terapija?: string;
  napomena?: string;
  status: string; // "zakazan", "obavljen", "otkazan"

  pacijentIme: string;
  pacijentPrezime: string;

  doktorIme?: string;
  doktorPrezime?: string;
};
