
import {
  Box,
  Typography
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Kartica from "./Kartica";
import "../../styles.css";
import NavBar from "../../components/NavBar";

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
];

const sliderItems = [
  {
    slika:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1500&q=80",
    naslov: "Dobrodošli u digitalnu ambulantu",
    opis: "Jednostavno upravljajte pregledima, pacijentima i nalozima.",
  },
  {
    slika:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1500&q=80",
    naslov: "Brza komunikacija i zakazivanje",
    opis: "Povežite pacijente i ljekare uz samo nekoliko klikova.",
  },
  {
    slika:
      "https://images.unsplash.com/photo-1588774069163-64c238faadb3?auto=format&fit=crop&w=1500&q=80",
    naslov: "Savremeno rješenje za zdravstvene ustanove",
    opis: "Digitalizujte svakodnevne procese i olakšajte rad osoblju.",
  },
];

export default function HomePage() {

  return (
    <div className="homepage">
      {/* Navbar */}
        <NavBar opcije={opcije} />

      {/* Carousel */}
      <Box sx={{ mt: 8, width: "100%" }}>
        <Carousel indicators interval={4000}>
          {sliderItems.map((item, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                height: 400,
                backgroundImage: `url(${item.slika})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: 2,
                mx: 3,
              }}
            >
              <Box sx={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 2 }} />
              <Box sx={{ zIndex: 1, textAlign: "center", maxWidth: 700, px: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>{item.naslov}</Typography>
                <Typography variant="h6">{item.opis}</Typography>
              </Box>
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Brzi pristup kartice */}
      <Box sx={{ py: 6, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#0d47a1" }}>Brzi pristup</Typography>
        <div className="cards-container">
          {opcije.map((opcija, index) => (
            <Kartica key={index} kartica={opcija} />
          ))}
        </div>
      </Box>
    </div>
  );
}
