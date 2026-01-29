import { Box, Button, Grid } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import AppTextInput from "../../components/AppTextInput";
import AppSelect from "../../components/AppSelect";
import {
  type CreateZdravstvenoStanjeSchema,
  createZdravstvenoStanjeSchema,
} from "../../lib/schemas/createZdravstvenoStanjeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateZdravstvenoStanjeMutation } from "./doktorApi";

type Props = {
  pacijentId: number;
  refetch: () => void;
  onClose: () => void; 
};

export default function ZdravstvenoStanjeForm({
  pacijentId,
  refetch,
  onClose,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateZdravstvenoStanjeSchema>({
    mode: "onTouched",
    resolver: zodResolver(createZdravstvenoStanjeSchema),
    defaultValues: {
      naziv: "",
      tip: undefined,
      datumDijagnoze: "",
      napomena: "",
    },
  });

  const [createStanje] = useCreateZdravstvenoStanjeMutation();

  const onSubmit = async (data: CreateZdravstvenoStanjeSchema) => {
    try {
      await createStanje({ pacijentId, data }).unwrap();
      refetch(); 
      onClose(); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control} name="naziv" label="Naziv" />
          </Grid>

          <Grid size={6}>
            <AppSelect
              control={control}
              name="tip"
              label="Tip"
              options={[
                { value: "Bolest", label: "Bolest" },
                { value: "Alergija", label: "Alergija" },
              ]}
            />
          </Grid>

          <Grid size={6}>
            <Controller
              name="datumDijagnoze"
              control={control}
              render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Datum dijagnoze"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) =>
                      field.onChange(date ? date.format("YYYY-MM-DD") : "")
                    }
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid size={12}>
            <AppTextInput
              control={control}
              name="napomena"
              label="Napomena"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Otkaži
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Sačuvaj
          </Button>
        </Box>
      </form>
    </Box>
  );
}
