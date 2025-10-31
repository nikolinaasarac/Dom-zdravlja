import { Button, Paper, Box, Typography } from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../store/store";
import AppPagination from "../../components/AppPagination";
import { useState } from "react";
import type { Doktor } from "../../models/Doktor";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Search from "../../components/Search";
import { useFetchDoktoriQuery } from "../doktor/doktorApi";
import { resetParams, setPageNumber, setSearchTerm } from "./doktorSlice";
import TabelaDoktora from "../../components/TabelaDoktora";
import SortDoktor from "../../components/SortDoktor";
import { useDeleteDoktorMutation } from "../admin/adminApi";
import DoktorForm from "./DoktorForm";

export default function PrikazDoktora() {
  const doktorParams = useAppSelector((state) => state.doktor);
  const {
    data: doktori,
    isLoading,
    refetch,
  } = useFetchDoktoriQuery(doktorParams);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedDoktor, setSelectedDoktor] = useState<Doktor | null>(null);
  const [deleteDoktor] = useDeleteDoktorMutation();

  const handleSelectDoktor = (doktor: Doktor) => {
    setSelectedDoktor(doktor);
    setEditMode(true);
  };

  const handleDeleteDoktor = async (id: number) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovog doktora?"))
      return;
    try {
      await deleteDoktor(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (editMode)
    return (
      <DoktorForm
        setEditMode={setEditMode}
        doktor={selectedDoktor}
        refetch={refetch}
        setSelectedDoktor={setSelectedDoktor}
      />
    );

  if (isLoading || !doktori) return <div>Loading...</div>;

  return (
    <Box sx={{ backgroundColor: "#f3f5f9", p: 3, borderRadius: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 3,
          backgroundColor: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Search
          selector={(state: RootState) => state.doktor.searchTerm}
          setAction={setSearchTerm}
          label="Pretraži doktore"
        />
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <SortDoktor />
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={() => dispatch(resetParams())}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#fafafa",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            Resetuj
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => setEditMode(true)}
          >
            Novi doktor
          </Button>
        </Box>
      </Paper>

      {doktori.doktori && doktori.doktori.length > 0 ? (
        <>
          <TabelaDoktora
            handleSelectDoktor={handleSelectDoktor}
            handleDeleteDoktor={handleDeleteDoktor}
          />
          <Box sx={{ mt: 3 }}>
            <AppPagination
              metadata={doktori.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Box>
        </>
      ) : (
        <Typography variant="h5">Nema rezultata.</Typography>
      )}
    </Box>
  );
}
