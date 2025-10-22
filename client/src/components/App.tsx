import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { Box } from "@mui/material";
import NavBar from "./NavBar";

// Opcije za Navbar
const opcije = [
  { naziv: "Pacijenti", putanja: "/pacijenti" },
  { naziv: "Pregledi", putanja: "/pregledi" },
  { naziv: "Zakaži pregled", putanja: "/" },
  { naziv: "Moj nalog", putanja: "/moj-nalog" },
];

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar iznad svega */}
      <NavBar opcije={opcije} />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar sa leve strane */}
        <Sidebar />

        {/* Glavni sadržaj */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px", // visina Navbar-a da sadržaj ne bude ispod
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
