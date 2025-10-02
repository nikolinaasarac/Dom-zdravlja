import { useEffect, useState } from "react";
import type { Vakcinacija } from "../../models/Vakcinacija";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";

export default function PrikazVakcinacija() {
  const [vakcinacije, setVakcinacije] = useState<Vakcinacija[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetch(`https://localhost:5001/api/vakcinacije/${id}`)
        .then((response) => response.json())
        .then((data) => setVakcinacije(data));
    }
  }, [id]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ "& td, & th": { fontSize: "1rem" } }}>
        <TableHead>
          <TableRow>
            <TableCell>Naziv vakcine</TableCell>
            <TableCell>Datum primanja</TableCell>
            <TableCell>Doza</TableCell>
            <TableCell>Napomena</TableCell>
            <TableCell>Pacijent</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vakcinacije.map((vakcina) => (
            <TableRow key={vakcina.id}>
              <TableCell>{vakcina.nazivVakcine}</TableCell>
              <TableCell>{vakcina.datumPrimanja}</TableCell>
              <TableCell>{vakcina.doza}</TableCell>
              <TableCell>{vakcina.napomena ?? "-"}</TableCell>
              <TableCell>
                {vakcina.pacijentIme} {vakcina.pacijentPrezime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
