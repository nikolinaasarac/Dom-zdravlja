import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useFetchPacijentiQuery } from "./pacijentApi";

export default function PrikazPacijenata() {
  const { data: pacijenti, isLoading } = useFetchPacijentiQuery();

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ "& td, & th": { fontSize: "1rem" } }}>
        <TableHead>
          <TableRow>
            <TableCell>Ime</TableCell>
            <TableCell>Prezime</TableCell>
            <TableCell>Datum rođenja</TableCell>
            <TableCell>Pol</TableCell>
            <TableCell>Adresa</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pacijenti.map((pacijent) => (
            <TableRow key={pacijent.id}>
              <TableCell>{pacijent.ime}</TableCell>
              <TableCell>{pacijent.prezime}</TableCell>
              <TableCell>{pacijent.datumRodjenja}</TableCell>
              <TableCell>{pacijent.pol}</TableCell>
              <TableCell>{pacijent.adresa}</TableCell>
              <TableCell>{pacijent.telefon}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  to={`/pacijenti/${pacijent.id}/vakcine`}
                >
                  Prikazi detalje
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
