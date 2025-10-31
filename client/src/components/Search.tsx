import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../store/store";
import type { RootState } from "../store/store"; // tip Redux store-a

interface SearchProps {
  selector: (state: RootState) => string | undefined; // state selector vraća string
  setAction: (value: string) => { type: string; payload: string }; // tip Redux akcije
  label?: string;
}

export default function Search({ selector, setAction, label }: SearchProps) {
  const value = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState(value);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  return (
    <TextField
      label={label || "Pretraži"}
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
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      onChange={(e) => dispatch(setAction(e.target.value))}
    />
  );
}
