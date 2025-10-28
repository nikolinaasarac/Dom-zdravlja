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
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  useGetMojiZahtjeviQuery,
  useOdbijZahtjevMutation,
  useOdobriZahtjevMutation,
} from "../doktor/doktorApi";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function PrikazZahtjeva() {
  const { data: zahtjevi, isLoading, isError } = useGetMojiZahtjeviQuery();
  const [odobriZahtjev] = useOdobriZahtjevMutation();
  const [odbijZahtjev] = useOdbijZahtjevMutation();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleOpen = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate(dayjs());
  };

  const handleOdbij = async (id: number) => {
    await odbijZahtjev(id);
    console.log("Odbijen zahtjev ID:", id);
  };

  const handleOdobriConfirm = async () => {
    if (!selectedId || !selectedDate) return;
    const datumPregleda = selectedDate.toISOString();
    await odobriZahtjev({ id: selectedId, datumPregleda });
    console.log("Odobren zahtjev ID:", selectedId, "Datum:", datumPregleda);
    handleClose();
  };

  if (isLoading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (isError) {
    console.log(zahtjevi);
    return (
      <Typography color="error" align="center">
        Greška prilikom učitavanja zahtjeva.
      </Typography>
    );
  }
  if (!zahtjevi || zahtjevi.length === 0)
    return <Typography align="center">Trenutno nema zahtjeva.</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Moji zahtjevi
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Pacijent</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Opis</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum zahtjeva</TableCell>
              <TableCell></TableCell>
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
                <TableCell>
                  {new Date(z.datumZahtjeva).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpen(z.id)}
                    >
                      Odobri
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOdbij(z.id)}
                    >
                      Odbij
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Odaberi datum i vrijeme pregleda</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Datum i vrijeme pregleda"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Otkaži
          </Button>
          <Button
            onClick={handleOdobriConfirm}
            variant="contained"
            color="success"
          >
            Potvrdi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
