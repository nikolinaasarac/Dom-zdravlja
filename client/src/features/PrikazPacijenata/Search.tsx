import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { TextField } from "@mui/material";
import { setSearchTerm } from "./pacijentSlice";

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
      sx={{ width: "50%" }}
      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    />
  );
}
