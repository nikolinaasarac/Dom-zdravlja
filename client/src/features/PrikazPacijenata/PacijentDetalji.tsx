import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import { useEffect } from "react";

export default function PacijentDetalji() {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.nameid || payload?.id || payload?.sub || null;
    } catch (error) {
      console.error("Neispravan token:", error);
      return null;
    }
  };

  const tokenId = getUserIdFromToken();
  const id = paramId || tokenId;

  useEffect(() => {
    if (!paramId && tokenId) {
      navigate(`/pacijenti/${tokenId}`, { replace: true });
    }
  }, [paramId, tokenId, navigate]);

  if (!id) return <p>Nije moguće prikazati detalje — nema ID pacijenta.</p>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
