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

  if (isLoading || !pacijenti)
    return <Typography align="center">Učitavanje...</Typography>;

  return (
    <TableContainer
      component={Paper}
      sx={{ background: "transparent", boxShadow: "none" }}
    >
      <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Ime</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Prezime</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Datum rođenja</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Matični broj</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Pol</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Adresa</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Telefon</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Akcije
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pacijenti.pacijenti.map((pacijent) => (
            <TableRow
              key={pacijent.id}
              sx={{
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                  transform: "scale(1.01)", // manje zumiranje
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)", // suptilniji shadow
                },
              }}
            >
              <TableCell>{pacijent.ime}</TableCell>
              <TableCell>{pacijent.prezime}</TableCell>
              <TableCell>{pacijent.datumRodjenja}</TableCell>
              <TableCell>{pacijent.maticniBroj}</TableCell>
              <TableCell>{pacijent.pol}</TableCell>
              <TableCell>{pacijent.adresa}</TableCell>
              <TableCell>{pacijent.telefon}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/pacijenti/${pacijent.id}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<Search />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Pregled
                  </Button>
                  <Button
                    onClick={() => handleSelectPacijent(pacijent)}
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Uredi
                  </Button>
                  <Button
                    onClick={() => handleDeletePacijent(pacijent.id)}
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Obriši
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
