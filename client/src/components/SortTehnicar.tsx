import { TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setOrderBy } from "../features/PrikaziTehnicare/tehnicarSlice";

export default function SortTehnicar() {
  const dispatch = useAppDispatch();
  const { orderBy } = useAppSelector((state) => state.tehnicar);

  return (
    <TextField
      label="Sortiraj"
      variant="outlined"
      size="small"
      select
      slotProps={{ select: { native: true } }}
      sx={{ width: 200 }}
      value={orderBy} // controlled input
      onChange={(e) => dispatch(setOrderBy(e.target.value))}
    >
      <option value="ime">Po imenu</option>
      <option value="prezime">Po prezimenu</option>
    </TextField>
  );
}
