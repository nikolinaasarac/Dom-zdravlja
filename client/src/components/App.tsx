import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import { Box } from "@mui/material";
import NavBar from "./NavBar";

// Opcije za Navbar
const opcije = [
  { naziv: "Početna strana", putanja: "/homepage" },
  { naziv: "Pacijenti", putanja: "/pacijenti" },
  { naziv: "Svi pregledi", putanja: "/pregledi" },
  { naziv: "Moji zahtjevi", putanja: "/moji-zahtjevi" },
  { naziv: "Moj nalog", putanja: "/moj-nalog" },
];

function App() {
  const location = useLocation();

  // Ne prikazuj Navbar i Sidebar na login stranici
  const isLoginPage = location.pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {!isLoginPage && <NavBar opcije={opcije} />}

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {!isLoginPage && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: !isLoginPage ? "64px" : 0, // pomak za Navbar samo ako nije login
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
