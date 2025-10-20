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
import { useFetchPacijentPreglediQuery } from "./pacijentApi";

export default function PrikazPregleda() {
  const { id } = useParams<{ id: string }>();

  const { data: pregledi, isLoading } = useFetchPacijentPreglediQuery(
    id ? +id : 0
  );

  if (isLoading || !pregledi) return <div>Loading...</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ "& td, & th": { fontSize: "1rem" } }}>
        <TableHead>
          <TableRow>
            <TableCell>Datum pregleda</TableCell>
            <TableCell>Vrsta pregleda</TableCell>
            <TableCell>Opis simptoma</TableCell>
            <TableCell>Dijagnoza</TableCell>
            <TableCell>Terapija</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Doktor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pregledi.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {new Date(p.datumPregleda).toLocaleDateString()}
              </TableCell>
              <TableCell>{p.vrstaPregleda}</TableCell>
              <TableCell>{p.opisSimptoma ?? "-"}</TableCell>
              <TableCell>{p.dijagnoza ?? "-"}</TableCell>
              <TableCell>{p.terapija ?? "-"}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                {p.doktorIme} {p.doktorPrezime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
