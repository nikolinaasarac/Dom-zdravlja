import { useState } from "react"; // <--- Dodaj useState
import { useNavigate, useParams } from "react-router-dom";
import { useFetchPacijentByIdQuery } from "./pacijentApi";
import Grid from "@mui/material/Grid";
import {
  Card,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useFetchPacijentZdravstvenaStanjaQuery } from "../doktor/doktorApi";
import ZdravstvenaStanja from "../../components/ZdravstvenaStanja";
import ZdravstvenoStanjeForm from "../doktor/ZdravstvenoStanjeForm";
import KrvnaGrupaPrikaz from "./KrvnaGrupaPrikaz";

export default function PacijentPodaci() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false); // <-- ovo rešava greške openForm/setOpenForm

  const {
    data: pacijent,
    isLoading,
    isError,
  } = useFetchPacijentByIdQuery(Number(id));
  const { data: stanja, refetch } = useFetchPacijentZdravstvenaStanjaQuery(
    Number(id)
  );

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (isError || !pacijent)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Typography color="error" variant="h6">
          Došlo je do greške pri učitavanju podataka o pacijentu.
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Nazad
        </Button>
      </Box>
    );

  const Ikona = pacijent.pol.toLowerCase().startsWith("m")
    ? MaleIcon
    : FemaleIcon;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4, p: 3 }}>
        <Grid container spacing={3}>
          {/* Avatar */}
          <Grid
            size={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: "3px solid #1976d2",
                bgcolor: "#E3F2FD",
              }}
            >
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
              <Info
                label="Datum rođenja:"
                value={new Date(pacijent.datumRodjenja).toLocaleDateString(
                  "sr-Latn"
                )}
              />
              <Info label="Pol:" value={pacijent.pol} />
              <Info label="Adresa:" value={pacijent.adresa} />
              <Info label="Telefon:" value={pacijent.telefon} />
              <Info label="JMBG:" value={pacijent.maticniBroj} />
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Modal */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Dodaj novo zdravstveno stanje</DialogTitle>
        <DialogContent>
          <ZdravstvenoStanjeForm
            pacijentId={Number(id)}
            onClose={() => setOpenForm(false)} // <-- Dodaj ovu funkciju u Props ZdravstvenoStanjeForm
            refetch={refetch} // <-- Proveri da li ZdravstvenoStanjeForm prima refetch u Props
          />
        </DialogContent>
      </Dialog>

      <KrvnaGrupaPrikaz pacijentId={Number(id)} />

      <ZdravstvenaStanja
        stanja={stanja}
        setOpenForm={setOpenForm}
      ></ZdravstvenaStanja>
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
