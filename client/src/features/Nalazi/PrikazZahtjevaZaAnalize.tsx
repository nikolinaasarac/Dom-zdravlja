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
import { useAppSelector } from "../../store/store";

function ZahtjevRow({
  z,
  refetch,
}: {
  z: ZahtjevZaAnalizu;
  refetch: () => void;
}) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState(z.status);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [promijeniStatus] = usePromijeniStatusMutation();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const getAllowedStatuses = (trenutni: string) => {
    switch (trenutni) {
      case "Na čekanju":
        return ["U obradi", "Odbijen"];
      case "U obradi":
        return ["Obrađen"];
      default:
        return []; 
    }
  };

  const allowedStatuses = getAllowedStatuses(z.status);

  const handleSaveStatus = async () => {
    if (status === z.status) return;
    if (status === "Obrađen") {
      setOpenDialog(true);
      return;
    }
    try {
      await promijeniStatus({ id: z.id, noviStatus: status }).unwrap();
      refetch();
      setSnackbarMessage(`Status uspješno promijenjen u "${status}"!`);
      setOpenSnackbar(true);
    } catch {
      setSnackbarMessage("Greška prilikom promjene statusa!");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell width={50}>
          <IconButton
            size="small"
            onClick={() => setOpenCollapse(!openCollapse)}
          >
            {openCollapse ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {z.pacijentIme} {z.pacijentPrezime}
        </TableCell>
        <TableCell>
          {z.doktorIme} {z.doktorPrezime}
        </TableCell>
        <TableCell>
          {z.tehnicarIme ? `${z.tehnicarIme} ${z.tehnicarPrezime}` : "-"}
        </TableCell>

        <TableCell>
          {userRole === "Tehnicar" && allowedStatuses.length > 0 ? (
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
            >
              <MenuItem value={z.status} disabled>
                {z.status}
              </MenuItem>
              {allowedStatuses.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography>{z.status}</Typography>
          )}
        </TableCell>

        <TableCell>{new Date(z.datumZahtjeva).toLocaleDateString()}</TableCell>

        <TableCell>
          {userRole === "Tehnicar" && allowedStatuses.length > 0 && (
            <Button variant="contained" size="small" onClick={handleSaveStatus}>
              Sačuvaj
            </Button>
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: "none" }}>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <Box
              sx={{ m: 2, p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Detalji zahtjeva
              </Typography>
              <Typography>
                <b>Opis:</b> {z.opis ?? "-"}
              </Typography>
              {z.tehnicarIme && (
                <Typography>
                  <b>Tehničar:</b> {z.tehnicarIme} {z.tehnicarPrezime}
                </Typography>
              )}
              {z.status === "Obrađen" && userRole === "Tehnicar" && (
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => setOpenDialog(true)}
                >
                  Upload nalaza
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload nalaza</DialogTitle>
        <DialogContent>
          <UploadNalazForm
            zahtjev={z}
            onSuccess={async () => {
              await promijeniStatus({
                id: z.id,
                noviStatus: "Obrađen",
              }).unwrap();
              setOpenSnackbar(true);
              setSnackbarMessage(
                "Nalaz uspješno uploadovan i status postavljen na 'Obrađen'!"
              );
              setOpenDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function NoviZahtjevForm({
  pacijentId,
  onSuccess,
  onClose,
}: {
  pacijentId: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
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
        <Button variant="contained" onClick={handleSubmit}>
          Kreiraj zahtjev
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function PrikazZahtjevaZaAnalize({
  filterStatus,
}: {
  filterStatus?: "svi" | "na-cekanju" | "pacijent";
}) {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const { id } = useParams<{ id: string }>();
  const pacijentId = id ? Number(id) : undefined;

  const [openNoviDialog, setOpenNoviDialog] = useState(false);

  const {
    data: sviZahtjevi,
    isLoading: loadingSvi,
    refetch: refetchSvi,
  } = useGetZahtjeviQuery();
  const {
    data: zahtjeviPacijenta,
    isLoading: loadingPacijent,
    refetch: refetchPacijent,
  } = useGetZahtjeviPacijentaQuery(
    !pacijentId || isNaN(pacijentId) ? skipToken : pacijentId
  );
  const {
    data: zahtjeviNaCekanju,
    isLoading: loadingNaCekanju,
    refetch: refetchNaCekanju,
  } = useGetZahtjeviNaCekanjuQuery();

  let zahtjevi: ZahtjevZaAnalizu[] | undefined,
    isLoading: boolean,
    refetch: () => void;

  if (filterStatus === "na-cekanju") {
    zahtjevi = zahtjeviNaCekanju;
    isLoading = loadingNaCekanju;
    refetch = refetchNaCekanju;
  } else if (pacijentId) {
    zahtjevi = zahtjeviPacijenta;
    isLoading = loadingPacijent;
    refetch = refetchPacijent;
  } else {
    zahtjevi = sviZahtjevi;
    isLoading = loadingSvi;
    refetch = refetchSvi;
  }

  if (isLoading || !zahtjevi)
    return <Typography align="center">Učitavanje...</Typography>;

  return (
    <>
      {pacijentId && filterStatus !== "na-cekanju" && userRole === "Doktor" && (
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenNoviDialog(true)}
        >
          Dodaj novi zahtjev
        </Button>
      )}

      <TableContainer
        component={Paper}
        sx={{ background: "transparent", boxShadow: "none" }}
      >
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
            {zahtjevi.map((z) => (
              <ZahtjevRow key={z.id} z={z} refetch={refetch} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filterStatus !== "na-cekanju" && pacijentId && (
        <Dialog
          open={openNoviDialog}
          onClose={() => setOpenNoviDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Kreiraj novi zahtjev</DialogTitle>
          <DialogContent>
            <NoviZahtjevForm
              pacijentId={pacijentId}
              onSuccess={refetch}
              onClose={() => setOpenNoviDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
