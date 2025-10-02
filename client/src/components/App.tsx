import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrikazPacijenata from "../features/PrikazPacijenata/PrikazPacijenata";
import PrikazVakcinacija from "../features/PrikazPacijenata/PrikazVakcina";
import PacijentDetalji from "../features/PrikazPacijenata/PacijentDetalji";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Lista svih pacijenata */}
        <Route path="/" element={<PrikazPacijenata />} />

        {/* Ruta za odabranog pacijenta sa sidebarom */}
        <Route path="/pacijenti/:id" element={<PacijentDetalji />}>
          <Route path="vakcine" element={<PrikazVakcinacija />} />
          <Route path="pregledi" element={<h2>Ovde idu pregledi...</h2>} />
          <Route path="karton" element={<h2>Ovde ide karton pacijenta...</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
