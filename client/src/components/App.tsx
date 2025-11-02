import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import { Box } from "@mui/material";
import NavBar from "./NavBar";

// Opcije za Navbar
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
    allowedRoles: ["Pacijent", "Doktor"],
  },
  { naziv: "Nalozi", putanja: "/nalozi", allowedRoles: ["Admin"] },

  {
    naziv: "Moj nalog",
    putanja: "/moj-nalog",
    allowedRoles: ["Pacijent", "Doktor", "Admin", "Tehnicar"],
  },
];

import { useAppSelector } from "../store/store";

function App() {
  const location = useLocation();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const isLoginPage = location.pathname === "/";
  const isChangePasswordPage = location.pathname === "/promijeni-lozinku";

  // Filtriraj opcije prema roli
  const filteredOpcije = opcije.filter((opcija) =>
    userRole ? opcija.allowedRoles.includes(userRole) : false
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {!isLoginPage && !isChangePasswordPage && (
        <NavBar opcije={filteredOpcije} />
      )}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
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
