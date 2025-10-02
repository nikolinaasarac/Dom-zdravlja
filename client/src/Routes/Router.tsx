import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import PacijentDetalji from "../features/PrikazPacijenata/PacijentDetalji";
import PrikazPacijenata from "../features/PrikazPacijenata/PrikazPacijenata";
import PrikazVakcinacija from "../features/PrikazPacijenata/PrikazVakcina";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <PrikazPacijenata /> },
        { path: "/pacijenti/:id", element: <PacijentDetalji /> },
        { path: "/vakcine", element: <PrikazVakcinacija /> },
        { path: "/pacijenti/:id/vakcine", element: <PrikazVakcinacija /> },
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
