import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBar";

export default function PacijentDetalji() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Pacijent nije odabran</p>;

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar sa tabovima pacijenta */}
      <Sidebar />

      {/* Glavni sadržaj */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
