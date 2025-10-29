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

export type Korisnik = {
  id: number;
  username: string;
  role: string;
};
