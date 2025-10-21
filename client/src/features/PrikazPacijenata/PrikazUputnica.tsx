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
import { useFetchUputniceQuery } from "./pacijentApi";

export default function TabelaUputnica() {
  const { id } = useParams<{ id: string }>();
  const { data: uputnice, isLoading } = useFetchUputniceQuery(id ? +id : 0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const openPdfPreview = async (id: number) => {
    const response = await fetch(`https://localhost:5001/api/uputnice/${id}/pdf`);
    if (!response.ok) {
      alert("Greška pri otvaranju PDF-a");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    setPreviewUrl(url);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl); // oslobodi memoriju
    }
    setPreviewUrl(null);
  };

  const downloadPdf = async (id: number) => {
    const response = await fetch(`https://localhost:5001/api/uputnice/${id}/pdf`);
    if (!response.ok) {
      alert("Greška pri preuzimanju PDF-a");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `uputnica_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          component={Link}
          to={`/pacijenti/${id}/uputnice/dodaj`}
          variant="contained"
          color="success"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Nova uputnica
        </Button>
      </Box>

      {isLoading ? (
        <Typography align="center">Učitavanje uputnica...</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ background: "transparent", boxShadow: "none" }}
        >
          <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Dijagnoza</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Opis</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Upućuje se</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Datum izdavanja</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Akcije
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {uputnice && uputnice.map((uputnica) => (
                <TableRow
                  key={uputnica.id}
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
                  <TableCell>{uputnica.dijagnoza}</TableCell>
                  <TableCell>{uputnica.opis}</TableCell>
                  <TableCell>{uputnica.upucujeSe}</TableCell>
                  <TableCell>
                    {new Date(uputnica.datumIzdavanja).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button
                        onClick={() => openPdfPreview(uputnica.id)}
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Search />}
                      >
                        Pregled
                      </Button>
                      <Button
                        onClick={() => downloadPdf(uputnica.id)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<Download />}
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

      {/* Modalni PDF pregled */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Pregled uputnice
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
