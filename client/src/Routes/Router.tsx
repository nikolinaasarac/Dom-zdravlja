import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import PrikazPacijenata from "../features/PrikazPacijenata/PrikazPacijenata";
import PrikazVakcinacija from "../features/PrikazPacijenata/PrikazVakcina";
import HomePage from "../features/PocetnaStrana/HomePage";
import LoginPage from "../features/Login/LoginPage";
import PacijentPodaci from "../features/PrikazPacijenata/pacijentPodaci";
import TabelaUputnica from "../features/PrikazPacijenata/PrikazUputnica";
import UputnicaForm from "../features/PrikazPacijenata/UputnicaForm";
import PrikazSvihPregleda from "../features/PrikazPacijenata/PrikazSvihPregleda";
import ZahtjevForm from "../features/pacijent/ZahtjevForm";
import PrikazZahtjeva from "../features/pacijent/PrikazZahtjeva";
import MojNalog from "../features/korisnik/MojNalog";
import Korisnici from "../features/admin/Korisnici";
import KreirajNalogForm from "../features/admin/KreirajNalogForm";
import PrikazZahtjevaZaAnalize from "../features/Nalazi/PrikazZahtjevaZaAnalize";
import PrikazNalaza from "../features/Nalazi/PrikazNalaza";
//import PacijentForm from "../features/admin/PacijentForm";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <LoginPage /> },
        { path: "/homepage", element: <HomePage /> },
        { path: "/pacijenti", element: <PrikazPacijenata /> },
        { path: "/pacijenti/:id", element: <PacijentPodaci /> },
        { path: "/vakcine", element: <PrikazVakcinacija /> },
        { path: "/pacijenti/:id/vakcine", element: <PrikazVakcinacija /> },
        //{ path: "/pregledi/:id", element: <Pregledi tip={"pacijent"} /> },
        { path: "/pacijenti/:id/uputnice", element: <TabelaUputnica /> },
        { path: "/pacijenti/:id/uputnice/dodaj", element: <UputnicaForm /> },
        //{ path: "/pregledi", element: <Pregledi tip={"doktor"} /> },
        { path: "/pregledi", element: <PrikazSvihPregleda /> },
        { path: "/zahtjev", element: <ZahtjevForm /> },
        { path: "/moji-zahtjevi", element: <PrikazZahtjeva /> },
        { path: "/moj-nalog", element: <MojNalog /> },
        { path: "/nalozi", element: <Korisnici /> },
        { path: "/kreiraj-nalog", element: <KreirajNalogForm /> },
        { path: "/pacijenti/:id/zahtjevi-analiza", element: <PrikazZahtjevaZaAnalize /> },
        { path: "/pacijenti/:id/nalazi", element: <PrikazNalaza /> },
        { path: "zahtjevi-analize", element: <PrikazZahtjevaZaAnalize /> },




        /*{ path: "/pacijenti/dodaj", element: <PacijentForm setEditMode={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } pacijent={null} refetch={function (): void {
          throw new Error("Function not implemented.");
        } } setSelectedPacijent={function (value: { id?: number; ime: string; prezime: string; datumRodjenja: Date; pol: string; adresa: string; telefon: string; maticniBroj: string; } | null): void {
          throw new Error("Function not implemented.");
        } } /> },*/
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
