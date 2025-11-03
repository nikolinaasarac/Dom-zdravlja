import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import { useEffect } from "react";

export default function PacijentDetalji() {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 🔹 Pomoćna funkcija za uzimanje ID-a iz JWT tokena
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // nameid, id ili sub — zavisi kako je token formiran
      return payload?.nameid || payload?.id || payload?.sub || null;
    } catch (error) {
      console.error("Neispravan token:", error);
      return null;
    }
  };

  // 🔹 Ako nema ID-a u URL-u, uzmi iz tokena
  const tokenId = getUserIdFromToken();
  const id = paramId || tokenId;

  // 🔹 Ako nema ID u URL-u, automatski preusmjeri sa token ID-em
  useEffect(() => {
    if (!paramId && tokenId) {
      navigate(`/pacijenti/${tokenId}`, { replace: true });
    }
  }, [paramId, tokenId, navigate]);

  // 🔹 Ako nema ni u URL-u ni u tokenu → nema prikaza
  if (!id) return <p>Nije moguće prikazati detalje — nema ID pacijenta.</p>;

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
