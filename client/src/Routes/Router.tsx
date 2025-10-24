import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import PrikazPacijenata from "../features/PrikazPacijenata/PrikazPacijenata";
import PrikazVakcinacija from "../features/PrikazPacijenata/PrikazVakcina";
import HomePage from "../features/PocetnaStrana/HomePage";
import LoginPage from "../features/Login/LoginPage";
import PacijentPodaci from "../features/PrikazPacijenata/pacijentPodaci";
import TabelaUputnica from "../features/PrikazPacijenata/PrikazUputnica";
import UputnicaForm from "../features/PrikazPacijenata/UputnicaForm";
import Pregledi from "../features/Pregledi/Pregledi";
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
        { path: "/pregledi/:id", element: <Pregledi tip={"pacijent"} /> },
        { path: "/pacijenti/:id/uputnice", element: <TabelaUputnica /> },
        { path: "/pacijenti/:id/uputnice/dodaj", element: <UputnicaForm /> },
        { path: "/pregledi", element: <Pregledi tip={"doktor"} /> },

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
