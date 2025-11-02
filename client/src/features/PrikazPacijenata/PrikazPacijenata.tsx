import { Button, Paper, Box, Typography } from "@mui/material";
import { useFetchPacijentiQuery } from "./pacijentApi";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../store/store";
import { resetParams, setPageNumber, setSearchTerm } from "./pacijentSlice";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import AppPagination from "../../components/AppPagination";
import TabelaPacijenata from "../../components/TabelaPacijenata";
import { useState } from "react";
import type { Pacijent } from "../../models/Pacijent";
import { useDeletePacijentMutation } from "../admin/adminApi";
import PacijentForm from "../admin/PacijentForm";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Search from "../../components/Search";

export default function PrikazPacijenata() {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const pacijentParams = useAppSelector((state) => state.pacijent);
  const {
    data: pacijenti,
    isLoading,
    refetch,
  } = useFetchPacijentiQuery(pacijentParams);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedPacijent, setSelectedPacijent] = useState<Pacijent | null>(
    null
  );
  const [deletePacijent] = useDeletePacijentMutation();

  const handleSelectPacijent = (pacijent: Pacijent) => {
    setSelectedPacijent(pacijent);
    setEditMode(true);
  };

  const handleDeletePacijent = async (id: number) => {
    const confirmDelete = window.confirm(
      "Jeste li sigurni da želite obrisati ovog pacijenta?"
    );
    if (!confirmDelete) return;

    try {
      await deletePacijent(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  if (editMode)
    return (
      <PacijentForm
        setEditMode={setEditMode}
        pacijent={selectedPacijent}
        refetch={refetch}
        setSelectedPacijent={setSelectedPacijent}
      />
    );

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        backgroundColor: "#f3f5f9",
        p: 3,
        borderRadius: 3,
      }}
    >
      {/* Gornji bar: pretraga + filteri + dugmad */}
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
        {/* ✅ Moderno Search polje */}
        <Search
          selector={(state: RootState) => state.pacijent.searchTerm}
          setAction={setSearchTerm}
          label="Pretraži pacijente"
        />

        {/* Desna strana: filteri + dugmad */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Filter />
          <Sort />
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
          {userRole! === "Admin" && (
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
              Novi pacijent
            </Button>
          )}
        </Box>
      </Paper>

      {pacijenti.pacijenti && pacijenti.pacijenti.length > 0 ? (
        <>
          {/* Tabela */}
          <TabelaPacijenata
            handleSelectPacijent={handleSelectPacijent}
            handleDeletePacijent={handleDeletePacijent}
            userRole={userRole!}
          />

          <Box sx={{ mt: 3 }}>
            <AppPagination
              metadata={pacijenti.pagination}
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
