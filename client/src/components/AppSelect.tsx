import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  useController,
  type FieldValues,
  type UseControllerProps
} from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

type Props<T extends FieldValues> = {
  label: string;
  options: Option[];
} & UseControllerProps<T>;

export default function AppSelect<T extends FieldValues>({
  name,
  label,
  control,
  options,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label} value={field.value || ""}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}
