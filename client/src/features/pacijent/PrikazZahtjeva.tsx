import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useGetMojiZahtjeviQuery } from "../doktor/doktorApi";

export default function PrikazZahtjeva() {
  const { data: zahtjevi, isLoading, isError } = useGetMojiZahtjeviQuery();

  if (isLoading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (isError)
    return <Typography color="error" align="center">Greška prilikom učitavanja zahtjeva.</Typography>;
  if (!zahtjevi || zahtjevi.length === 0)
    return <Typography align="center">Trenutno nema zahtjeva.</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Moji zahtjevi
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Pacijent</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Opis</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum zahtjeva</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {zahtjevi.map((z) => (
              <TableRow
                key={z.id}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.3s",
                }}
              >
                <TableCell>{`${z.pacijentIme} ${z.pacijentPrezime}`}</TableCell>
                <TableCell>{`${z.doktorIme} ${z.doktorPrezime}`}</TableCell>
                <TableCell>{z.opis}</TableCell>
                <TableCell>{z.status}</TableCell>
                <TableCell>{new Date(z.datumZahtjeva).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
