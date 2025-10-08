import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type Props = {
  kartica: {
    naziv: string;
    opis: string;
    putanja: string;
    slika: string;
  };
};

export default function Kartica({ kartica }: Props) {
  return (
    <Card
      component={Link}
      to={kartica.putanja}
      elevation={3}
      sx={{
        width: 150,
        height: 200,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // centriranje horizontalno
        justifyContent: "center", // centriranje vertikalno
        background: "#ffffff",
        padding: 2,
        margin: 1, // smanjen razmak između kartica
        textDecoration: "none",
        transition: "transform 0.3s ease",
        "&:hover": {
          cursor: "pointer",
          transform: "scale(1.05)",
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 80, // smanjena širina
          height: 80, // fiksna visina, ne 100%
          objectFit: "contain",
          borderRadius: 2,
        }}
        image={kartica.slika}
        alt={kartica.naziv}
      />
      <CardContent
        sx={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 4, // malo razmaka do naziv
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            color: "#70a9fd",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {kartica.naziv.toUpperCase()}
        </Typography>
      </CardContent>
    </Card>
  );
}
