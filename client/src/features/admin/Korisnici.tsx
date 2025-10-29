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
import { useNavigate } from "react-router-dom";
import { useDeleteKorisnikMutation, useFetchKorisniciQuery } from "./adminApi";
//import type { Korisnik } from "../../models/Korisnik";

/*type Props = {
  handleSelectKorisnik: (korisnik: Korisnik) => void;
  handleDeleteKorisnik: (id: string) => void;
};*/
export default function TabelaNaloga() {
  const { data: korisnici, isLoading, refetch } = useFetchKorisniciQuery();
  const [deleteKorisnik] = useDeleteKorisnikMutation();
  const navigate = useNavigate();

  const handleDeleteKorisnik = async (id: string) => {
    const confirmDelete = window.confirm(
      "Jeste li sigurni da želite obrisati ovog pacijenta?"
    );
    if (!confirmDelete) return;
    try {
      await deleteKorisnik(id).unwrap();
      alert("Korisnik uspješno obrisan!");
      refetch();
    } catch (error) {
      console.error("Greška pri brisanju korisnika:", error);
      alert("Brisanje nije uspjelo.");
    }
  };

  if (isLoading || !korisnici)
    return <Typography align="center">Učitavanje...</Typography>;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 2,
          px: 3,
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
        }}
        //onClick={() => setEditMode(true)}
        onClick={() => navigate("/noviKorisnik")}
      >
        Novi korisnik
      </Button>
      <TableContainer
        component={Paper}
        sx={{ background: "transparent", boxShadow: "none" }}
      >
        <Table sx={{ borderSpacing: "0 12px", borderCollapse: "separate" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Korisničko ime</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rola</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ime i prezime</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {korisnici.map((korisnik) => (
              <TableRow
                key={korisnik.id}
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
                    boxShadow: "0 4px 12px rgba(61, 30, 30, 0.12)",
                  },
                }}
              >
                <TableCell>{korisnik.username}</TableCell>
                <TableCell>{korisnik.role}</TableCell>
                <TableCell>
                  {korisnik.ime} {korisnik.prezime}
                </TableCell>

                <TableCell>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Button
                      //onClick={() => handleSelectKorisnik(korisnik)}
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<Edit />}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Uredi
                    </Button>
                    <Button
                      onClick={() => handleDeleteKorisnik(korisnik.id)}
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
    </>
  );
}
