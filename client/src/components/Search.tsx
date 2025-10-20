import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { setSearchTerm } from "../features/PrikazPacijenata/pacijentSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
  const { searchTerm } = useAppSelector((state) => state.pacijent);
  const dispatch = useAppDispatch();

  const [term, setTerm] = useState(searchTerm); //pocetna vrijednost polja term

  useEffect(() => {
    setTerm(searchTerm);
  }, [searchTerm]); //svaki put kad se promijeni vrijednost searchTerm postavi novi

  return (
    <TextField
      label="Pretraži pacijente"
      type="search"
      value={term}
      sx={{
        width: "40%",
        minWidth: "280px",
        backgroundColor: "#fafafa",
        borderRadius: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#fff",
            boxShadow: "0 0 0 2px rgba(25,118,210,0.15)",
          },
          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(25,118,210,0.2)" },
        },
        "& input": { fontSize: "0.95rem" },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {" "}
            <SearchIcon color="action" />{" "}
          </InputAdornment>
        ),
      }}
      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    />
  );
}
