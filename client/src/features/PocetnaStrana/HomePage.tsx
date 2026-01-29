import { Box, Grid, IconButton, Link, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Kartica from "./Kartica";
import "../../styles.css";
import NavBar from "../../components/NavBar";
import { useAppSelector } from "../../store/store";
import { useGetMyAccountQuery } from "../korisnik/korisnikApi";
import { AccessTime, Email, Facebook, Instagram, LinkedIn, LocationOn, Phone } from "@mui/icons-material";


const opcije = [
  {
    naziv: "Početna strana",
    opis: "",
    putanja: "/homepage",
    slika: "./../../../images/pocetnaStrana.png",
    allowedRoles: ["Pacijent", "Doktor", "Admin", "Tehničar"],
  },
  {
    naziv: "Pacijenti",
    opis: "Prikaži i upravljaj pacijentima",
    putanja: "/pacijenti",
    slika: `./../../../images/pacijent.png`,
    allowedRoles: ["Doktor", "Admin", "Tehnicar"],
  },
  {
    naziv: "Svi pregledi",
    opis: "Pregledaj evidenciju svih pregleda",
    putanja: "/pregledi",
    slika: `./../../../images/pregled.png`,
    allowedRoles: ["Doktor"],
  },
  {
    naziv: "Zahtjev za pregled", 
    opis: "Kreiraj novi zahtjev za pregled",
    putanja: "/zahtjev",
    slika: `./../../../images/zahtjevPregled.png`, 
    allowedRoles: ["Pacijent"],
  },
  {
    naziv: "Moji zahtjevi", 
    opis: "Prikaz svih vaših zahtjeva",
    putanja: "/moji-zahtjevi",
    slika: `./../../../images/zahtjevPregled.png`, 
    allowedRoles: ["Pacijent"],
  },
  {
    naziv: "Zahtjevi za analize",
    opis: "Prikaži i upravljaj zahtjevima za laboratorijske analize",
    putanja: "/zahtjevi-analize",
    slika: `./../../../images/ZahtjeviZaAnalize.png`,
    allowedRoles: ["Tehnicar"],
  },

  {
    naziv: "Zahtjevi na čekanju",
    opis: "Prikaži i upravljaj zahtjevima za laboratorijske analize",
    putanja: "/zahtjevi-na-cekanju",
    slika: `./../../../images/zahtjeviNaCekanju.png`, 
    allowedRoles: ["Tehnicar"],
  },

  {
    naziv: "Doktori",
    opis: "Prikaz statističkih podataka",
    putanja: "/doktori",
    slika: "./../../../images/doktor.png",
    allowedRoles: ["Admin"],
  },
  {
    naziv: "Tehničari",
    opis: "Prikaz statističkih podataka",
    putanja: "/tehnicari",
    slika: "./../../../images/tehnicar.png",
    allowedRoles: ["Admin"],
  },
  {
    naziv: "Korisnički nalozi",
    opis: "Prikaz korisnika sistema",
    putanja: "/nalozi",
    slika: "./../../../images/korisnici.png",
    allowedRoles: ["Admin"],
  },
  {
    naziv: "Moj nalog",
    opis: "Prikaz statističkih podataka",
    putanja: "/moj-nalog",
    slika: "./../../../images/mojNalog.png",
    allowedRoles: ["Pacijent", "Doktor", "Admin", "Tehnicar"],
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
    slika: "./../../../images/slide3.png",
    naslov: "Savremeno rješenje za zdravstvene ustanove",
    opis: "Digitalizujte svakodnevne procese i olakšajte rad osoblju.",
  },
];

export default function HomePage() {
  const { isLoading } = useGetMyAccountQuery();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  if (isLoading) return <Typography>Učitavanje...</Typography>;

  return (
    <Box className="homepage">
      <NavBar opcije={opcije} />

      <Box sx={{ width: "100%" }}>
        <Carousel indicators interval={4000} animation="slide">
          {sliderItems.map((item, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                height: 500,
                backgroundImage: `url(${item.slika})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                mx: 3,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: 2,
                }}
              />
              {item.naslov && (
                <Box
                  sx={{ zIndex: 1, textAlign: "center", maxWidth: 700, px: 2 }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 1, color: "#fff" }}
                  >
                    {item.naslov}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {item.opis}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Carousel>
      </Box>

      <Box
        sx={{
          py: 6,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="cards-container">
          {opcije
            .filter((opcija) => opcija.allowedRoles.includes(userRole!))
            .map((opcija, index) => (
              <Kartica key={index} kartica={opcija} />
            ))}
        </div>
      </Box>

      <Box
        sx={{
          background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
          py: 8,
          mt: 6,
          borderRadius: "15px 15px 0 0",
        }}
      >
        <Grid container spacing={4} justifyContent="center" textAlign="center">

          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Kontakt
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: "#00796b" }} />
              <Typography>Ulica 123, Grad</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <Email sx={{ mr: 1, color: "#00796b" }} />
              <Typography>info@digitalna-ambulanta.com</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone sx={{ mr: 1, color: "#00796b" }} />
              <Typography>+387 65 123 456</Typography>
            </Box>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Radno vrijeme
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: "#00796b" }} />
              <Typography>Pon-Pet: 08:00 - 20:00</Typography>
            </Box>
            <Typography>Sub: 08:00 - 14:00</Typography>
            <Typography>Ned: Zatvoreno</Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Društvene mreže
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton
                component={Link}
                href="#"
                target="_blank"
                sx={{
                  color: "#00796b",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#b2ebf2", transform: "scale(1.1)" },
                  transition: "all 0.2s",
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component={Link}
                href="#"
                target="_blank"
                sx={{
                  color: "#00796b",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#b2ebf2", transform: "scale(1.1)" },
                  transition: "all 0.2s",
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component={Link}
                href="#"
                target="_blank"
                sx={{
                  color: "#00796b",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#b2ebf2", transform: "scale(1.1)" },
                  transition: "all 0.2s",
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

