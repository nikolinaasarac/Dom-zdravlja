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
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchPacijentPreglediQuery } from "./pacijentApi";
import type { Pregled } from "../../models/Pregled";

function PregledRow({ p }: { p: Pregled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
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
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "#fff !important",
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
        <TableCell sx={{ fontWeight: 500 }}>
          {new Date(p.datumPregleda).toLocaleDateString()}
        </TableCell>
        <TableCell>{p.vrstaPregleda}</TableCell>
        <TableCell>{p.status}</TableCell>
        <TableCell>
          {p.doktorIme} {p.doktorPrezime}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, border: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
                p: 2,
                backgroundColor: "#fafafa",
                borderRadius: 2,
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Detalji pregleda
              </Typography>

              <Typography sx={{ mb: 0.5 }}>
                <b>Dijagnoza:</b> {p.dijagnoza ?? "-"}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>
                <b>Terapija:</b> {p.terapija ?? "-"}
              </Typography>
              <Typography>
                <b>Opis simptoma:</b> {p.opisSimptoma ?? "-"}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function PrikazPregleda() {
  const { id } = useParams<{ id: string }>();
  const { data: pregledi, isLoading } = useFetchPacijentPreglediQuery(
    id ? +id : 0
  );

  if (!pregledi)
    return <Typography align="center">Nema pregleda za izabranog pacijenta.</Typography>;

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
            <TableCell sx={{ fontWeight: "bold" }}>Datum pregleda</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Vrsta pregleda</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Doktor</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pregledi.map((p: Pregled) => (
            <PregledRow key={p.id} p={p} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
