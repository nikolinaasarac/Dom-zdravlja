import { TextField } from "@mui/material";
import { setPol } from "./pacijentSlice";
import { useAppDispatch } from "../../store/store";

export default function Filter() {
  const dispatch=useAppDispatch()

  return (
    <TextField
      label="Filter po polu"
      variant="outlined"
      size="small"
      select
      SelectProps={{ native: true }}
      sx={{ width: 200 }}
      onChange={e => dispatch(setPol(e.target.value))}
    >
      <option value=""></option>
      <option value="Muški">Muški</option>
      <option value="Ženski">Ženski</option>
    </TextField>
  )
}