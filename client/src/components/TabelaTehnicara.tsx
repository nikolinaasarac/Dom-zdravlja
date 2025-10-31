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
import type { Tehnicar } from "../models/Tehnicar";
import { useFetchTehnicariQuery } from "../features/admin/adminApi";

type Props = {
  handleSelectTehnicar: (tehnicar: Tehnicar) => void;
  handleDeleteTehnicar: (id: number) => void;
};

export default function TabelaTehnicara({
  handleSelectTehnicar,
  handleDeleteTehnicar,
}: Props) {
  const tehnicarParams = useAppSelector((state) => state.tehnicar);
  const { data: tehnicari, isLoading } = useFetchTehnicariQuery(tehnicarParams);

  if (isLoading || !tehnicari)
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
            <TableCell sx={{ fontWeight: "bold" }}>Telefon</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Adresa</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Akcije
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tehnicari.tehnicari.map((tehnicar) => (
            <TableRow
              key={tehnicar.id}
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
                  transform: "scale(1.01)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              <TableCell>{tehnicar.ime}</TableCell>
              <TableCell>{tehnicar.prezime}</TableCell>
              <TableCell>{tehnicar.maticniBroj}</TableCell>
              <TableCell>{tehnicar.telefon}</TableCell>
              <TableCell>{tehnicar.email}</TableCell>
              <TableCell>{tehnicar.adresa}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Button
                    onClick={() => handleSelectTehnicar(tehnicar)}
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Uredi
                  </Button>
                  <Button
                    onClick={() => handleDeleteTehnicar(tehnicar.id)}
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
