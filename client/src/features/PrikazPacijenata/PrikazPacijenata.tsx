import { Button, Grid, Paper, Typography } from "@mui/material";
import { useFetchPacijentiQuery } from "./pacijentApi";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { resetParams, setPageNumber } from "./pacijentSlice";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import AppPagination from "../../components/AppPagination";
import TabelaPacijenata from "../../components/TabelaPacijenata";
import Search from "../../components/Search";
import { useState } from "react";
import type { Pacijent } from "../../models/Pacijent";
import { useDeletePacijentMutation } from "../admin/adminApi";
import PacijentForm from "../admin/PacijentForm";

export default function PrikazPacijenata() {
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
    if (!confirmDelete) return; // Ako korisnik klikne "Cancel", prekida se

    try {
      await deletePacijent(id);
      refetch(); // ponovo učitava pacijente posle brisanja
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
      ></PacijentForm>
    );

  if (isLoading || !pacijenti) return <div>Loading...</div>;

  return (
    <Grid container spacing={2}>
      {/* NOVO: Dugme za dodavanje pacijenta */}
      <Grid size={12}>
        <Button
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
          onClick={() => setEditMode(true)}
        >
          + Dodaj novog pacijenta
        </Button>
      </Grid>

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
          <Search />
          <Filter />
          <Sort />

          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetParams())}
          >
            Resetuj parametre
          </Button>
        </Paper>
      </Grid>

      {/* Donji dio - tabela */}
      <Grid size={12}>
        {pacijenti.pacijenti && pacijenti.pacijenti.length > 0 ? (
          <>
            <TabelaPacijenata
              handleSelectPacijent={handleSelectPacijent}
              handleDeletePacijent={handleDeletePacijent}
            />
            <AppPagination
              metadata={pacijenti.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        ) : (
          <Typography variant="h5">Nema rezultata.</Typography>
        )}
      </Grid>
    </Grid>
  );
}
