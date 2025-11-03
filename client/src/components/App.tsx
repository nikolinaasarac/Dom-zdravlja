import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useAppSelector } from "../store/store";
import { pacijentApi } from "../features/PrikazPacijenata/pacijentApi";

// 🔹 Sve opcije u navbaru
const opcije = [
  {
    naziv: "Početna strana",
    putanja: "/homepage",
    allowedRoles: ["Pacijent", "Doktor", "Admin", "Tehnicar"],
  },
  {
    naziv: "Pacijenti",
    putanja: "/pacijenti",
    allowedRoles: ["Doktor", "Admin"],
  },
  {
    naziv: "Doktori",
    putanja: "/doktori",
    allowedRoles: ["Admin"],
  },
  {
    naziv: "Tehničari",
    putanja: "/tehnicari",
    allowedRoles: ["Admin"],
  },
  {
    naziv: "Svi pregledi",
    putanja: "/pregledi",
    allowedRoles: ["Doktor"],
  },
  {
    naziv: "Moji zahtjevi",
    putanja: "/moji-zahtjevi",
    allowedRoles: ["Doktor"],
  },
  { naziv: "Nalozi", putanja: "/nalozi", allowedRoles: ["Admin"] },
  {
    naziv: "Moj nalog",
    putanja: "/moj-nalog",
    allowedRoles: ["Pacijent", "Doktor", "Admin", "Tehnicar"],
  },
  // 🔹 Nova opcija – Moj karton (samo za pacijenta)
  {
    naziv: "Moj karton",
    putanja: "/pacijenti/moj-karton",
    allowedRoles: ["Pacijent"],
  },
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const isLoginPage = location.pathname === "/";
  const isChangePasswordPage = location.pathname === "/promijeni-lozinku";

  // 🔹 Filtriraj opcije prema roli korisnika
  const filteredOpcije = opcije.filter((opcija) =>
    userRole ? opcija.allowedRoles.includes(userRole) : false
  );

  // 🔹 RTK Query hook za dobijanje pacijentId
  const { data: pacijentId } = pacijentApi.useGetMojPacijentIdQuery(undefined, {
    skip: userRole !== "Pacijent",
  });

  // 🔹 Preusmjeri pacijenta na njegov ID kad otvori Moj karton
  useEffect(() => {
    if (location.pathname === "/pacijenti/moj-karton" && pacijentId) {
      navigate(`/pacijenti/${pacijentId}`, { replace: true });
    }
  }, [location.pathname, navigate, pacijentId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 🔹 NavBar prikazujemo samo kad nije login ili promjena lozinke */}
      {!isLoginPage && !isChangePasswordPage && (
        <NavBar opcije={filteredOpcije} />
      )}

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* 🔹 Sidebar se prikazuje samo van login strane */}
        {!isLoginPage && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: !isLoginPage ? "64px" : 0,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
