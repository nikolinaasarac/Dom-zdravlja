import { Button, Paper, Box, Typography } from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../../store/store";
import AppPagination from "../../components/AppPagination";
import { useState } from "react";
import type { Tehnicar } from "../../models/Tehnicar";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Search from "../../components/Search";
import {
  useDeleteTehnicarMutation,
  useFetchTehnicariQuery,
} from "../admin/adminApi";
import TehnicarForm from "./TehnicarForm";
import { resetParams, setPageNumber, setSearchTerm } from "./tehnicarSlice";
import TabelaTehnicara from "../../components/TabelaTehnicara";
import SortTehnicar from "../../components/SortTehnicar";

export default function PrikazTehnicara() {
  const tehnicarParams = useAppSelector((state) => state.tehnicar);
  const {
    data: tehnicari,
    isLoading,
    refetch,
  } = useFetchTehnicariQuery(tehnicarParams);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedTehnicar, setSelectedTehnicar] = useState<Tehnicar | null>(
    null
  );
  const [deleteTehnicar] = useDeleteTehnicarMutation();

  const handleSelectTehnicar = (tehnicar: Tehnicar) => {
    setSelectedTehnicar(tehnicar);
    setEditMode(true);
  };

  const handleDeleteTehnicar = async (id: number) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovog tehničara?"))
      return;
    try {
      await deleteTehnicar(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (editMode)
    return (
      <TehnicarForm
        setEditMode={setEditMode}
        tehnicar={selectedTehnicar}
        refetch={refetch}
        setSelectedTehnicar={setSelectedTehnicar}
      />
    );

  if (isLoading || !tehnicari) return <div>Loading...</div>;

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
          selector={(state: RootState) => state.tehnicar.searchTerm}
          setAction={setSearchTerm}
          label="Pretraži tehničare"
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
          <SortTehnicar />
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
            Novi tehničar
          </Button>
        </Box>
      </Paper>

      {tehnicari.tehnicari && tehnicari.tehnicari.length > 0 ? (
        <>
          <TabelaTehnicara
            handleSelectTehnicar={handleSelectTehnicar}
            handleDeleteTehnicar={handleDeleteTehnicar}
          />
          <Box sx={{ mt: 3 }}>
            <AppPagination
              metadata={tehnicari.pagination}
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
