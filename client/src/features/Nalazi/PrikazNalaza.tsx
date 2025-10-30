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
import { useParams } from "react-router-dom";// tvoj RTK query za nalaze
import { useGetNalaziPacijentaQuery } from "./nalazApi";

export default function PrikazNalaza() {
  const { id } = useParams<{ id: string }>();
  const { data: nalazi, isLoading } = useGetNalaziPacijentaQuery(id ? +id : 0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const openPdfPreview = (filePath: string) => {
    const url = `https://localhost:5001/${filePath}`;
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

  const downloadPdf = (filePath: string, nalazId: number) => {
    const url = `https://localhost:5001/${filePath}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nalaz_${nalazId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box>

      {isLoading ? (
        <Typography align="center">Učitavanje nalaza...</Typography>
      ) : nalazi && nalazi.length > 0 ? (
        <TableContainer component={Paper} sx={{ background: "transparent", boxShadow: "none" }}>
          <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Tehničar</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Datum dodavanja</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Akcije
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nalazi.map((nalaz) => (
                <TableRow
                  key={nalaz.id}
                  sx={{
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                    "& td:first-of-type": { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
                    "& td:last-of-type": { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
                    "&:hover": { transform: "scale(1.01)", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
                  }}
                >
                  <TableCell>{nalaz.tehnicarIme} {nalaz.tehnicarPrezime}</TableCell>
                  <TableCell>{new Date(nalaz.datumDodavanja).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button
                        onClick={() => openPdfPreview(nalaz.filePath)}
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Search />}
                      >
                        Pregled
                      </Button>
                      <Button
                        onClick={() => downloadPdf(nalaz.filePath, nalaz.id)}
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
      ) : (
        <Typography align="center">Nema nalaza za izabranog pacijenta.</Typography>
      )}

      {/* Modalni PDF pregled */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Pregled nalaza
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
