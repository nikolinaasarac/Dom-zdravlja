import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useFetchPacijentiQuery } from "../features/PrikazPacijenata/pacijentApi";
import { useAppSelector } from "../store/store";

export default function TabelaPacijenata() {
  const pacijentParams = useAppSelector((state) => state.pacijent);
  const { data: pacijenti, isLoading } = useFetchPacijentiQuery(pacijentParams);

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ tableLayout: "fixed", "& td, & th": { fontSize: "1rem" } }}
      >
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
          {pacijenti.pacijenti.map((pacijent) => (
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
                  variant="outlined"
                >
                  Prikaži detalje
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}