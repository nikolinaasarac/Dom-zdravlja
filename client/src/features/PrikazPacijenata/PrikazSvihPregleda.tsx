import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import type { Pregled } from "../../models/Pregled";
import PregledForm from "../doktor/PregledForm";
import { useFetchPreglediQuery } from "../doktor/doktorApi";
import { useFetchPacijentPreglediQuery } from "./pacijentApi";

function PregledRow({ p, refetch }: { p: Pregled; refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {/* Glavni red */}
      <TableRow
        hover
        sx={{
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            backgroundColor: "#fff",
          },
        }}
      >
        <TableCell width={50}>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {p.pacijentIme} {p.pacijentPrezime}
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>
          {new Date(p.datumPregleda).toLocaleDateString()}
        </TableCell>
        <TableCell>{p.vrstaPregleda}</TableCell>
        <TableCell>{p.status}</TableCell>
        <TableCell>
          {p.doktorIme} {p.doktorPrezime}
        </TableCell>
      </TableRow>

      {/* Collapse red */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
                p: 2,
                backgroundColor: "#fafafa",
                borderRadius: 2,
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Detalji pregleda
              </Typography>

              <Typography>
                <b>Opis simptoma:</b> {p.opisSimptoma ?? "-"}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>
                <b>Dijagnoza:</b> {p.dijagnoza ?? "-"}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>
                <b>Terapija:</b> {p.terapija ?? "-"}
              </Typography>
              <Typography>
                <b>Napomena:</b> {p.napomena ?? "-"}
              </Typography>

              <Button
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 2.5,
                  py: 1,
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  "&:hover": {
                    borderColor: "#125ea2",
                    backgroundColor: "rgba(25,118,210,0.08)",
                  },
                  display: "block",
                  ml: "auto",
                  mt: 1.5,
                }}
                onClick={() => setOpenDialog(true)}
              >
                Unesi detalje
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Modal forma */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Unesi detalje pregleda</DialogTitle>
        <DialogContent>
          <PregledForm
            pregled={p}
            setEditMode={() => setOpenDialog(false)}
            refetch={refetch}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

interface Props {
  pacijentId?: number;
}

export default function PrikazSvihPregleda({ pacijentId }: Props) {
  // ✅ Hookovi se pozivaju uvek, ali API se preskače pomoću skip opcije
  const {
    data: preglediPacijenta,
    isLoading: loadingPacijent,
    refetch: refetchPacijent,
  } = useFetchPacijentPreglediQuery(pacijentId!, {
    skip: !pacijentId,
  });

  const {
    data: sviPregledi,
    isLoading: loadingSvi,
    refetch: refetchSvi,
  } = useFetchPreglediQuery(undefined, {
    skip: !!pacijentId,
  });

  const pregledi = pacijentId ? preglediPacijenta : sviPregledi;
  const isLoading = pacijentId ? loadingPacijent : loadingSvi;
  const refetch = pacijentId ? refetchPacijent : refetchSvi;

  if (!pregledi)
    return <Typography align="center">Nema pregleda.</Typography>;

  if (isLoading)
    return <Typography align="center">Učitavanje...</Typography>;

  return (
    <TableContainer
      component={Paper}
      sx={{ background: "transparent", boxShadow: "none" }}
    >
      <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold" }}>Pacijent</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Datum pregleda</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Vrsta pregleda</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pregledi.map((p: Pregled) => (
            <PregledRow key={p.id} p={p} refetch={refetch} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
