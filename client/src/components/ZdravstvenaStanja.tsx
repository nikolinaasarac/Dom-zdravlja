import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import type { ZdravstvenoStanje } from "../models/ZdravstvenoStanje";

export type Props = {
  stanja: ZdravstvenoStanje[] | undefined;
  setOpenForm: (open: boolean) => void;
  userRole: string;
};

export default function ZdravstvenaStanja({
  stanja,
  setOpenForm,
  userRole,
}: Props) {
  return (
    <Card
      sx={{ mt: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}
    >
      <CardContent>
        {/* Naslov i dugme uvijek prikazani */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Alergije / Bolesti
          </Typography>
          {userRole! === "Doktor" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenForm(true)}
            >
              Dodaj novo zdravstveno stanje
            </Button>
          )}
        </Box>

        {/* Ako nema podataka */}
        {!stanja ? (
          <Typography variant="body2" color="text.secondary">
            Trenutno nema evidentiranih stanja.
          </Typography>
        ) : stanja.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Pacijent trenutno nema evidentiranih zdravstvenih stanja.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {stanja.map((a) => (
              <Grid size={6} key={a.id}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor:
                      a.tip.toLowerCase() === "alergija"
                        ? "#64b5f6"
                        : "#42a5f5",
                    backgroundColor:
                      a.tip.toLowerCase() === "alergija"
                        ? "#e3f2fd"
                        : "#bbdefb",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box mb={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#0d47a1" }}
                    >
                      {a.naziv}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Tip: {a.tip}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Datum dijagnoze:{" "}
                    {new Date(a.datumDijagnoze).toLocaleDateString()}
                  </Typography>
                  {a.napomena && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Napomena: {a.napomena}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
