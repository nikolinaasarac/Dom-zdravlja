import { Grid, Typography, Button, Box } from "@mui/material";
import "../../styles.css";
import Kartica from "./Kartica";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../features/Login/authApi";
import { useAppDispatch } from "../../store/store";
import { logout as logoutRedux } from "../../features/Login/authSlice";
import { setAccessToken } from "../../features/Login/tokenStore";

const opcije = [
  {
    naziv: "Pacijenti",
    opis: "Prikaži i upravljaj pacijentima",
    putanja: "/pacijenti",
    slika: `./../../../images/pacijent.png`,
  },
  {
    naziv: "Pregledi",
    opis: "Pregledaj evidenciju vakcinacija",
    putanja: "/pregledi",
    slika: `./../../../images/pregled.png`,
  },
  {
    naziv: "Zakaži pregled",
    opis: "Pregledaj evidenciju vakcinacija",
    putanja: "/",
    slika: `./../../../images/zakaziPregled.png`,
  },
  {
    naziv: "Moj nalog",
    opis: "Prikaz statističkih podataka",
    putanja: "/",
    slika: "./../../../images/mojNalog.png",
  },
  {
    naziv: "Moj nalog",
    opis: "Prikaz statističkih podataka",
    putanja: "/",
    slika: "./../../../images/mojNalog.png",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      setAccessToken(null); // ukloni runtime access token
      dispatch(logoutRedux()); // očisti Redux auth state
      navigate("/", { replace: true }); // preusmjeri na login
      await authApi.logout(); // poziv backend logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="homepage">
      {/* Header sa Logout dugmetom */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        width="90%"
        mx="auto"
      >
        <Typography variant="h2" sx={{ color: "white" }}>
          Dobro došli!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ height: 40 }}
        >
          Logout
        </Button>
      </Box>

      {/* Grid sa opcijama */}
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "70vh" }} // vertikalno centriranje
      >
        {opcije.map((opcija, index) => (
          <Grid key={index} size={3} display="flex" justifyContent="center">
            <Kartica kartica={opcija} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
