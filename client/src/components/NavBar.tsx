import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { authApi } from "../features/Login/authApi";
import { setAccessToken } from "../features/Login/tokenStore";
import { useAppDispatch } from "../store/store";
import { logout as logoutRedux } from "../features/Login/authSlice";
import { doktorApi } from "../features/doktor/doktorApi";
import { pacijentApi } from "../features/PrikazPacijenata/pacijentApi";
import { adminApi } from "../features/admin/adminApi";
import { korisnikApi } from "../features/korisnik/korisnikApi";
import { zahtjevApi } from "../features/Nalazi/zahtjevApi";
import { nalazApi } from "../features/Nalazi/nalazApi";

interface Opcija {
  naziv: string;
  putanja: string;
}

interface NavbarProps {
  opcije: Opcija[];
}

export default function Navbar({ opcije }: NavbarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setAccessToken(null);
      dispatch(logoutRedux());

      // 🔹 resetuje sve keširane podatke iz RTK Query
      dispatch(doktorApi.util.resetApiState());
      dispatch(pacijentApi.util.resetApiState());
      dispatch(adminApi.util.resetApiState());
      dispatch(korisnikApi.util.resetApiState());
      dispatch(zahtjevApi.util.resetApiState());
      dispatch(nalazApi.util.resetApiState());

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(21,101,192,0.9)",
        backdropFilter: "blur(4px)",
        zIndex: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 0 }}>
          {/* Logo */}
          <Box sx={{ height: 50 }}>
            <img
              src="/images/logo.png" // stavi putanju do svog logotipa
              alt="Logo"
              style={{ height: "100%", objectFit: "contain" }}
            />
          </Box>

          {/* Ime aplikacije */}
          <Typography
            variant="subtitle1" // manji tekst
            sx={{ fontWeight: "bold", color: "#ffffffff", letterSpacing: 0.5 }}
          >
            eAmbulanta
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {opcije.map((opcija, i) => (
            <Button
              key={i}
              color="inherit"
              onClick={() => navigate(opcija.putanja)}
            >
              {opcija.naziv}
            </Button>
          ))}
          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem onClick={() => navigate("/moj-nalog")}>
              Moj nalog
            </MenuItem>
            <MenuItem onClick={handleLogout}>Odjavi se</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
