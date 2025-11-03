export type Doktor = {
  id: number;
  ime: string;
  prezime: string;
  specijalizacija?: string;
  brojLicence: string;
  telefon: string;
  email: string;
  adresa: string;
};

export type Pacijent = {
  id: number;
  ime: string;
  prezime: string;
  jmbg?: string;
  datumRodjenja: string;
  adresa: string;
  telefon: string;
};
export interface Korisnik {
  id: string;
  username: string;
  role: string;
  doktor?: {
    ime: string;
    prezime: string;
    specijalizacija: string;
    brojLicence: string;
    telefon: string;
    email: string;
    adresa: string;
  } | null;
  pacijent?: {
    ime: string;
    prezime: string;
    maticniBroj: string;
    datumRodjenja: string;
    adresa: string;
  } | null;
  tehnicar?: {
    ime: string;
    prezime: string;
    maticniBroj: string;
    telefon: string;
    email: string;
    adresa: string;
  }
}