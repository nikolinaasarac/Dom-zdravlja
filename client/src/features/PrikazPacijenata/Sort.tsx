import { TextField } from "@mui/material";
import { setOrderBy } from "./pacijentSlice";
import { useAppDispatch } from "../../store/store";

export default function Sort() {
const dispatch = useAppDispatch();

  return (

    <TextField
      label="Sortitaj"
      variant="outlined"
      size="small"
      select
      SelectProps={{ native: true }}
      sx={{ width: 200 }}
      onChange={e => dispatch(setOrderBy(e.target.value))}
    >
      <option value=""></option>
      <option value="datum">Po datumu</option>
      <option value="ime">Po imenu</option>
      <option value="prezime">Po prezimenu</option>
    </TextField>
  )
}