import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Box,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { ZahtjevZaAnalizu } from "../../models/ZahtjevZaAnalizu";
import UploadNalazForm from "./UploadNalazForm";
import {
  useGetZahtjeviQuery,
  useGetZahtjeviPacijentaQuery,
  useGetZahtjeviNaCekanjuQuery,
  usePromijeniStatusMutation,
  useKreirajZahtjevMutation,
} from "./zahtjevApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

function ZahtjevRow({ z, refetch }: { z: ZahtjevZaAnalizu; refetch: () => void }) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState(z.status);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [promijeniStatus] = usePromijeniStatusMutation();

  const handleSaveStatus = async () => {
    if (status !== z.status) {
      await promijeniStatus({ id: z.id, noviStatus: status });
      refetch();
      setSnackbarMessage(`Status uspješno promijenjen u "${status}"!`);
      setOpenSnackbar(true);
      if (status === "Obrađen") setOpenDialog(true);
    }
  };

  const handleUploadSuccess = () => {
    setSnackbarMessage("Upload nalaza uspješno završen!");
    setOpenSnackbar(true);
    setOpenDialog(false);
    refetch();
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          "& td:first-of-type": { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
          "& td:last-of-type": { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
          "&:hover": { transform: "scale(1.01)", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" },
        }}
      >
        <TableCell width={50}>
          <IconButton size="small" onClick={() => setOpenCollapse(!openCollapse)}>
            {openCollapse ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{z.pacijentIme} {z.pacijentPrezime}</TableCell>
        <TableCell>{z.doktorIme} {z.doktorPrezime}</TableCell>
        <TableCell>{z.tehnicarIme ? `${z.tehnicarIme} ${z.tehnicarPrezime}` : "-"}</TableCell>
        <TableCell>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small">
            <MenuItem value="Na čekanju">Na čekanju</MenuItem>
            <MenuItem value="U obradi">U obradi</MenuItem>
            <MenuItem value="Obrađen">Obrađen</MenuItem>
            <MenuItem value="Odbijen">Odbijen</MenuItem>
          </Select>
        </TableCell>
        <TableCell>{new Date(z.datumZahtjeva).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button variant="outlined" size="small" onClick={handleSaveStatus}>
            Završi
          </Button>
        </TableCell>
      </TableRow>

      {/* Collapse detalji */}
      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: "none" }}>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2, p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Detalji zahtjeva
              </Typography>
              <Typography><b>Opis:</b> {z.opis ?? "-"}</Typography>
              {z.tehnicarIme && (
                <Typography><b>Tehničar:</b> {z.tehnicarIme} {z.tehnicarPrezime}</Typography>
              )}
              {status === "Obrađen" && (
                <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setOpenDialog(true)}>
                  Upload nalaza
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>{snackbarMessage}</Alert>
      </Snackbar>

      {/* Dialog za upload */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Upload nalaza</DialogTitle>
        <DialogContent>
          <UploadNalazForm zahtjev={z} onSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------- Forma za kreiranje novog zahtjeva ----------
function NoviZahtjevForm({ pacijentId, onSuccess, onClose }: { pacijentId: number, onSuccess: () => void, onClose: () => void }) {
  const [opis, setOpis] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [kreirajZahtjev] = useKreirajZahtjevMutation();

  const handleSubmit = async () => {
    if (!opis.trim()) return;
    try {
      await kreirajZahtjev({ pacijentId, data: { opis } }).unwrap();
      setSnackbarMessage("Zahtjev uspješno kreiran!");
      setOpenSnackbar(true);
      onSuccess();
      onClose();
    } catch {
      setSnackbarMessage("Greška prilikom kreiranja zahtjeva!");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Opis zahtjeva"
          multiline
          rows={4}
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSubmit}>Kreiraj zahtjev</Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}

// ---------- Glavna komponenta ----------
export default function PrikazZahtjevaZaAnalize({
  filterStatus,
}: {
  filterStatus?: "svi" | "na-cekanju" | "pacijent";
}) {
  const { id } = useParams<{ id: string }>();
  const [openNoviDialog, setOpenNoviDialog] = useState(false);

  const { data: sviZahtjevi, isLoading: loadingSvi, refetch: refetchSvi } = useGetZahtjeviQuery();
  const { data: zahtjeviPacijenta, isLoading: loadingPacijent, refetch: refetchPacijent } = useGetZahtjeviPacijentaQuery(id ? Number(id) : skipToken);
  const { data: zahtjeviNaCekanju, isLoading: loadingNaCekanju, refetch: refetchNaCekanju } = useGetZahtjeviNaCekanjuQuery();

  let zahtjevi, isLoading, refetch;

  if (filterStatus === "na-cekanju") {
    zahtjevi = zahtjeviNaCekanju;
    isLoading = loadingNaCekanju;
    refetch = refetchNaCekanju;
  } else if (id) {
    zahtjevi = zahtjeviPacijenta;
    isLoading = loadingPacijent;
    refetch = refetchPacijent;
  } else {
    zahtjevi = sviZahtjevi;
    isLoading = loadingSvi;
    refetch = refetchSvi;
  }

  if (isLoading || !zahtjevi) return <Typography align="center">Učitavanje...</Typography>;

  return (
    <>
      {/* Dugme za novi zahtjev, samo ako gledamo pacijenta i nije filter 'na-cekanju' */}
      {id && filterStatus !== "na-cekanju" && (
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenNoviDialog(true)}>
          Dodaj novi zahtjev
        </Button>
      )}

      <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
        <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Pacijent</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tehničar</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum zahtjeva</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Akcija</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zahtjevi.map((z: ZahtjevZaAnalizu) => (
              <ZahtjevRow key={z.id} z={z} refetch={refetch} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog za novi zahtjev */}
      {filterStatus !== "na-cekanju" && id && (
        <Dialog open={openNoviDialog} onClose={() => setOpenNoviDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Kreiraj novi zahtjev</DialogTitle>
          <DialogContent>
            <NoviZahtjevForm
              pacijentId={Number(id)}
              onSuccess={refetch}
              onClose={() => setOpenNoviDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
