import { TextField } from "@mui/material";
import { setPol } from "../features/PrikazPacijenata/pacijentSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function Filter() {
  const dispatch = useAppDispatch();
  const { pol } = useAppSelector((state) => state.pacijent);

  return (
    <TextField
      label="Filter po polu"
      variant="outlined"
      size="small"
      select
      slotProps={{ select: { native: true } }}
      sx={{ width: 200 }}
      value={pol} // controlled input
      onChange={(e) => dispatch(setPol(e.target.value))}
    >
      <option value=""></option>
      <option value="Muški">Muški</option>
      <option value="Ženski">Ženski</option>
    </TextField>
  );
}
