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
import PromijeniLozinku from "../features/korisnik/PromijeniLozinku";
import PrikazZahtjevaZaAnalize from "../features/Nalazi/PrikazZahtjevaZaAnalize";
import PrikazNalaza from "../features/Nalazi/PrikazNalaza";
import PrikazDoktora from "../features/PrikazDoktora/PrikazDoktora";
import PrikazTehnicara from "../features/PrikaziTehnicare/PrikazTehnicara";
import TabelaRecepata from "../features/Recepti/TabelaRecepata";
import ReceptForm from "../features/Recepti/ReceptiForm";
import PreglediRoute from "./PreglediRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
//import PacijentForm from "../features/admin/PacijentForm";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          element: <PublicRoute />,
          children: [{ path: "/", element: <LoginPage /> },
          
            { path: "/promijeni-lozinku", element: <PromijeniLozinku /> },]
        },
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/homepage", element: <HomePage /> },
            { path: "/pacijenti", element: <PrikazPacijenata /> },
            { path: "/pacijenti/:id", element: <PacijentPodaci /> },
            { path: "/vakcine", element: <PrikazVakcinacija /> },
            { path: "/pacijenti/:id/vakcine", element: <PrikazVakcinacija /> },
            { path: "/pregledi/:id", element: <PreglediRoute /> },
            { path: "/pacijenti/:id/uputnice", element: <TabelaUputnica /> },
            {
              path: "/pacijenti/:id/uputnice/dodaj",
              element: <UputnicaForm />,
            },
            { path: "/pregledi", element: <PrikazSvihPregleda /> },
            { path: "/zahtjev", element: <ZahtjevForm /> },
            { path: "/moji-zahtjevi", element: <PrikazZahtjeva /> },
            { path: "/moj-nalog", element: <MojNalog /> },
            {
              path: "/promijeni-lozinku/:userId",
              element: <PromijeniLozinku />,
            },
            {
              path: "/pacijenti/:id/zahtjevi-analiza",
              element: <PrikazZahtjevaZaAnalize />,
            },
            { path: "/pacijenti/:id/nalazi", element: <PrikazNalaza /> },
            { path: "zahtjevi-analize", element: <PrikazZahtjevaZaAnalize /> },
            { path: "/pacijenti/:id/recepti", element: <TabelaRecepata /> },
            { path: "/pacijenti/:id/recepti/dodaj", element: <ReceptForm /> },
            {
              path: "zahtjevi-na-cekanju",
              element: <PrikazZahtjevaZaAnalize filterStatus="na-cekanju" />,
            },
            { path: "/nalozi", element: <Korisnici /> },

            { path: "/nalozi", element: <Korisnici /> },
            { path: "/kreiraj-nalog", element: <KreirajNalogForm /> },
            { path: "/doktori", element: <PrikazDoktora /> },
            { path: "/tehnicari", element: <PrikazTehnicara /> },
          ],
        },
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