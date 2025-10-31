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
import { Delete, Edit } from "@mui/icons-material";
import { useAppSelector } from "../store/store";
import type { Doktor } from "../models/Doktor";
import { useFetchDoktoriQuery } from "../features/doktor/doktorApi";

type Props = {
  handleSelectDoktor: (doktor: Doktor) => void;
  handleDeleteDoktor: (id: number) => void;
};

export default function TabelaDoktora({
  handleSelectDoktor,
  handleDeleteDoktor,
}: Props) {
  const doktorParams = useAppSelector((state) => state.doktor);
  const { data: doktori, isLoading } = useFetchDoktoriQuery(doktorParams);

  if (isLoading || !doktori)
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
            <TableCell sx={{ fontWeight: "bold" }}>Matični broj</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Specijalizacija</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Broj licence</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Telefon</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Adresa</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Akcije
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {doktori.doktori.map((doktor) => (
            <TableRow
              key={doktor.id}
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
              <TableCell>{doktor.ime}</TableCell>
              <TableCell>{doktor.prezime}</TableCell>
              <TableCell>{doktor.maticniBroj}</TableCell>
              <TableCell>{doktor.specijalizacija}</TableCell>
              <TableCell>{doktor.brojLicence}</TableCell>
              <TableCell>{doktor.telefon}</TableCell>
              <TableCell>{doktor.adresa}</TableCell>
              <TableCell>{doktor.email}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Button
                    onClick={() => handleSelectDoktor(doktor)}
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Uredi
                  </Button>
                  <Button
                    onClick={() => handleDeleteDoktor(doktor.id)}
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
