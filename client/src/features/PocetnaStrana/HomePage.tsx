import { Grid, Typography } from "@mui/material";
import "../../styles.css";
import Kartica from "./Kartica";

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
  return (
    <div className="homepage">
      <Typography
        variant="h2"
        sx={{
          color: "white",
          mb: 5,
        }}
      >
        Dobro došli!
      </Typography>
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
