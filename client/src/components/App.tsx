import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { Box } from "@mui/material";

function App() {
  return (
     <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // padding oko sadržaja
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
