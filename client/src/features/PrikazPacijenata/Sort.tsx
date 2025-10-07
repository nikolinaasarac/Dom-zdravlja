import { TextField } from "@mui/material";
import { setOrderBy } from "./pacijentSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function Sort() {
  const dispatch = useAppDispatch();
  const { orderBy } = useAppSelector((state) => state.pacijent);

  return (
    <TextField
      label="Sortiraj"
      variant="outlined"
      size="small"
      select
      SelectProps={{ native: true }}
      sx={{ width: 200 }}
      value={orderBy} // controlled input
      onChange={(e) => dispatch(setOrderBy(e.target.value))}
    >
      <option value="datum">Po datumu</option>
      <option value="ime">Po imenu</option>
      <option value="prezime">Po prezimenu</option>
    </TextField>
  );
}
