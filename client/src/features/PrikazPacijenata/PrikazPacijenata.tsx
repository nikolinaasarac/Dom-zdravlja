import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useFetchPacijentiQuery } from "./pacijentApi";
import { useAppSelector } from "../../store/store";

export default function PrikazPacijenata() {
  const pacijentParams = useAppSelector((state) => state.pacijent);
  const { data: pacijenti, isLoading } = useFetchPacijentiQuery(pacijentParams);

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <Grid container spacing={2}>
      {/* Gornji dio - pretraga i filteri */}
      <Grid size={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Pretraži pacijente"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          />

          <TextField
            label="Filter po polu"
            variant="outlined"
            size="small"
            select
            SelectProps={{ native: true }}
            sx={{ width: 200 }}
          >
            <option value=""></option>
            <option value="Muški">Muški</option>
            <option value="Ženski">Ženski</option>
          </TextField>

            <TextField
            label="Filter po polu"
            variant="outlined"
            size="small"
            select
            SelectProps={{ native: true }}
            sx={{ width: 200 }}
          >
            <option value=""></option>
            <option value="Muški">Muški</option>
            <option value="Ženski">Ženski</option>
          </TextField>

          <Button variant="contained" color="primary">
            Primijeni filtere
          </Button>
        </Paper>
      </Grid>

      {/* Donji dio - tabela */}
      <Grid size={12}>
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
      </Grid>
    </Grid>
  );
}
