import type { Doktor } from "./Doktor";
import type { Pacijent } from "./Pacijent";

export type ZahtjevZaPregled = {
  id: number;
  pacijentId: number;
  pacijent: Pacijent;
  doktorId: number;
  doktor: Doktor;
  doktorIme: string;
  doktorPrezime: string;
  pacijentIme: string;
  pacijentPrezime: string;
  datumZahtjeva: string; // DateTime se obično prima kao ISO string na frontendu
  opis: string;
  status: "Na čekanju" | "Prihvaćen" | "Odbijen"; // precizno ograničenje tipa
};