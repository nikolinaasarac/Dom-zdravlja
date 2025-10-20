import { useNavigate, useParams } from "react-router-dom";
import { useFetchPacijentByIdQuery } from "./pacijentApi";
import Grid from "@mui/material/Grid";
import { Card, Typography, Button, Avatar, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

export default function PacijentPodaci() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pacijent, isLoading, isError } = useFetchPacijentByIdQuery(Number(id));

  if (isLoading)
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  if (isError || !pacijent)
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Typography color="error" variant="h6">
          Došlo je do greške pri učitavanju podataka o pacijentu.
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          Nazad
        </Button>
      </Box>
    );

  const Ikona = pacijent.pol.toLowerCase().startsWith("m") ? MaleIcon : FemaleIcon;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4, p: 3 }}>
        <Grid container spacing={3}>
          {/* Avatar */}
          <Grid size={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Avatar sx={{ width: 120, height: 120, border: "3px solid #1976d2", bgcolor: "#E3F2FD" }}>
              <Ikona sx={{ fontSize: 80, color: "#1976d2" }} />
            </Avatar>
          </Grid>

          {/* Osnovni podaci */}
          <Grid size={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {pacijent.ime} {pacijent.prezime}
            </Typography>

            <Grid container spacing={1}>
              <Info label="Ime:" value={pacijent.ime} />
              <Info label="Prezime:" value={pacijent.prezime} />
              <Info label="Datum rođenja:" value={new Date(pacijent.datumRodjenja).toLocaleDateString("sr-Latn")} />
              <Info label="Pol:" value={pacijent.pol} />
              <Info label="Adresa:" value={pacijent.adresa} />
              <Info label="Telefon:" value={pacijent.telefon} />
              <Info label="JMBG:" value={pacijent.maticniBroj} />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <Grid size={6}>
      <Typography variant="body2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary">
        {value}
      </Typography>
    </Grid>
  );
}
