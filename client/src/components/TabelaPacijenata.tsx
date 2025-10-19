import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useFetchPacijentiQuery } from "../features/PrikazPacijenata/pacijentApi";
import { useAppSelector } from "../store/store";
import type { Pacijent } from "../models/Pacijent";

type Props = {
  handleSelectPacijent: (pacijent: Pacijent) => void;
  handleDeletePacijent: (id: number) => void;
};

export default function TabelaPacijenata({
  handleSelectPacijent,
  handleDeletePacijent,
}: Props) {
  const pacijentParams = useAppSelector((state) => state.pacijent);
  const { data: pacijenti, isLoading } = useFetchPacijentiQuery(pacijentParams);

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: "fixed", "& td, & th": { fontSize: "1rem" } }}>
        <TableHead>
          <TableRow>
            <TableCell>Ime</TableCell>
            <TableCell>Prezime</TableCell>
            <TableCell>Datum rođenja</TableCell>
            <TableCell>Matični broj</TableCell>
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
              <TableCell>{pacijent.maticniBroj}</TableCell>
              <TableCell>{pacijent.pol}</TableCell>
              <TableCell>{pacijent.adresa}</TableCell>
              <TableCell>{pacijent.telefon}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    p: 0,
                  }}
                >
                  <Button
                    component={Link}
                    to={`/pacijenti/${pacijent.id}/vakcine`}
                    startIcon={<Search />}
                    size="small"
                  />
                  <Button
                    onClick={() => handleSelectPacijent(pacijent)}
                    startIcon={<Edit />}
                    size="small"
                  />
                  <Button
                    onClick={() => handleDeletePacijent(pacijent.id)}
                    startIcon={<Delete />}
                    color="error"
                    size="small"
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
