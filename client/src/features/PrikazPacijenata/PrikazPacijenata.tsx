import {
  Button,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import { useFetchPacijentiQuery } from "./pacijentApi";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { resetParams, setPageNumber } from "./pacijentSlice";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import AppPagination from "../../components/AppPagination";
import TabelaPacijenata from "../../components/TabelaPacijenata";
import Search from "../../components/Search";

export default function PrikazPacijenata() {
  const pacijentParams = useAppSelector((state) => state.pacijent);
  const dispatch = useAppDispatch();
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
            <TabelaPacijenata />
            <AppPagination
              metadata={pacijenti.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page))
                window.scrollTo({ top: 0, behavior: 'smooth' })
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
