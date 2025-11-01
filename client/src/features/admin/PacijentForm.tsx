import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import AppTextInput from "../../components/AppTextInput";
import {
  type CreatePacijentSchema,
  createPacijentSchema,
} from "../../lib/schemas/createPacijentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreatePacijentMutation,
  useUpdatePacijentMutation,
} from "./adminApi";
import type { Pacijent } from "../../models/Pacijent";
import AppSelect from "../../components/AppSelect";

type Props = {
  setEditMode: (value: boolean) => void;
  pacijent: Pacijent | null;
  refetch: () => void;
  setSelectedPacijent: (value: Pacijent | null) => void;
};

export default function PacijentForm({
  setEditMode,
  pacijent,
  refetch,
  setSelectedPacijent,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    //setError,
    formState: { isSubmitting },
  } = useForm<CreatePacijentSchema>({
    mode: "onTouched",
    resolver: zodResolver(createPacijentSchema),
    defaultValues: {
      ime: "",
      prezime: "",
      datumRodjenja: "",
      pol: undefined,
      adresa: "",
      telefon: "",
      maticniBroj: "",
    },
  });

  const [createPacijent] = useCreatePacijentMutation();
  const [updatePacijent] = useUpdatePacijentMutation();

  useEffect(() => {
    if (pacijent) {
      reset({
        ...pacijent,
        pol:
          pacijent.pol === "Muški" || pacijent.pol === "Ženski"
            ? pacijent.pol
            : undefined,
        datumRodjenja: pacijent.datumRodjenja,
      });
    }
  }, [pacijent, reset]);

  /*const createFormData = (items: FieldValues) => {
    const formData = new FormData();

    for (const key in items) {
      formData.append(key, items[key]);
    }

    return formData;
  };*/

  const onSubmit = async (data: CreatePacijentSchema) => {
    try {
      if (pacijent && pacijent.id !== undefined) {
        await updatePacijent({ id: pacijent.id, data }).unwrap();
      } else {
        await createPacijent(data).unwrap();
      }

      setEditMode(false);
      setSelectedPacijent(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "md", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {pacijent ? "Uredi pacijenta" : "Dodaj novog pacijenta"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <AppTextInput control={control} name="ime" label="Ime" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="prezime" label="Prezime" />
          </Grid>

          <Grid size={6}>
            <Controller
              name="datumRodjenja"
              control={control}
              render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Datum rođenja"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) =>
                      field.onChange(date ? date.format("YYYY-MM-DD") : null)
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

          <Grid size={6}>
            <AppSelect
              control={control}
              name="pol"
              label="Pol"
              options={[
                { value: "Muški", label: "Muški" },
                { value: "Ženski", label: "Ženski" },
              ]}
            />
          </Grid>
          <Grid size={12}>
            <AppTextInput control={control} name="adresa" label="Adresa" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="telefon" label="Telefon" />
          </Grid>
          <Grid size={6}>
            <AppTextInput
              control={control}
              name="maticniBroj"
              label="Matični broj"
            />
          </Grid>
        </Grid>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Button
            onClick={() => setEditMode(false)}
            variant="contained"
            color="inherit"
          >
            Otkaži
          </Button>
          <Button
            loading={isSubmitting}
            variant="contained"
            color="primary"
            type="submit"
          >
            Sačuvaj
          </Button>
        </Box>
      </form>
    </Box>
  );
}
