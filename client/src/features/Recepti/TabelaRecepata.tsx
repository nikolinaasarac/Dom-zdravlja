import { useState } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Download, Search, Close } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import {
  useFetchReceptiQuery,
  useLazyGetReceptPdfQuery,
} from "../PrikazPacijenata/pacijentApi";
import { useAppSelector } from "../../store/store";

export default function TabelaRecepata() {
  const { id } = useParams<{ id: string }>();
  const { data: recepti, isLoading } = useFetchReceptiQuery(id ? +id : 0);
  const [getReceptPdf] = useLazyGetReceptPdfQuery();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const userRole = useAppSelector((state) => state.auth.user?.role);

  const openPdfPreview = async (receptId: number) => {
    try {
      const blob = await getReceptPdf(receptId).unwrap();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setOpenDialog(true);
    } catch {
      alert("Greška pri otvaranju PDF-a");
    }
  };

  const downloadPdf = async (receptId: number) => {
    try {
      const blob = await getReceptPdf(receptId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recept_${receptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Greška pri preuzimanju PDF-a");
    }
  };

  const closeDialog = () => {
    setOpenDialog(false);
    if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {userRole === "Doktor" && (
          <Button
            component={Link}
            to={`/pacijenti/${id}/recepti/dodaj`}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Novi recept
          </Button>
        )}
      </Box>

      {
      !recepti ? <Typography align="center">Nema uputnica za izabranog pacijenta.</Typography>
      :
      isLoading ? (
        <Typography align="center">Učitavanje recepata...</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ background: "transparent", boxShadow: "none" }}
        >
          <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Naziv lijeka</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Količina</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Način uzimanja
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Napomena</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Datum izdavanja
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Akcije
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recepti?.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                    "& td:first-of-type": {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    "& td:last-of-type": {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                    "&:hover": {
                      transform: "scale(1.01)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <TableCell>{r.nazivLijeka}</TableCell>
                  <TableCell>{r.kolicina}</TableCell>
                  <TableCell>{r.nacinUzimanja}</TableCell>
                  <TableCell>{r.napomena || "-"}</TableCell>
                  <TableCell>
                    {new Date(r.datumIzdavanja).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Search />}
                        onClick={() => openPdfPreview(r.id)}
                      >
                        Pregled
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<Download />}
                        onClick={() => downloadPdf(r.id)}
                      >
                        Preuzmi PDF
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Pregled recepta
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewUrl && (
            <iframe
              src={previewUrl}
              style={{ width: "100%", height: "80vh", border: "none" }}
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
