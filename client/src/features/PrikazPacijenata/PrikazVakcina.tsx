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
import { useFetchPacijentVakcineQuery } from "./pacijentApi";

export default function PrikazVakcinacija() {
  const { id } = useParams<{ id: string }>();

  const { data: vakcinacije, isLoading } = useFetchPacijentVakcineQuery(
    id ? +id : 0
  );

  if (isLoading || !vakcinacije) return <div>Loading...</div>;

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
