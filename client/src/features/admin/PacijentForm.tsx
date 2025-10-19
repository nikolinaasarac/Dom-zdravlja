/*import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import AppTextInput from "../../components/AppTextInput";
import { type CreatePacijentSchema, createPacijentSchema } from "../../lib/schemas/createPacijentSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type Pacijent = {
  id?: number;
  ime: string;
  prezime: string;
  datumRodjenja: Date;
  pol: string;
  adresa: string;
  telefon: string;
  maticniBroj: string;
};

type Props = {
  setEditMode: (value: boolean) => void;
  pacijent: Pacijent | null;
  refetch: () => void;
  setSelectedPacijent: (value: Pacijent | null) => void;
};

export default function PacijentForm({ setEditMode, pacijent, refetch, setSelectedPacijent }: Props) {
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm<CreatePacijentSchema>({
    mode: "onTouched",
    resolver: zodResolver(createPacijentSchema),
    defaultValues: {
      ime: "",
      prezime: "",
      datumRodjenja: "",
      pol: "",
      adresa: "",
      telefon: "",
      maticniBroj: "",
    }
  });

  const [createPacijent] = useCreatePacijentMutation();
  const [updatePacijent] = useUpdatePacijentMutation();

  useEffect(() => {
    if (pacijent) reset(pacijent);
  }, [pacijent, reset]);

  const onSubmit = async (data: CreatePacijentSchema) => {
    try {
      if (pacijent) await updatePacijent({ id: pacijent.id, data }).unwrap();
      else await createPacijent(data).unwrap();

      setEditMode(false);
      setSelectedPacijent(null);
      refetch();
    } catch (error) {
      console.error(error);
      handleApiError<CreatePacijentSchema>(error, setError, [
        "ime", "prezime", "datumRodjenja", "pol", "adresa", "telefon", "maticniBroj"
      ]);
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

          <Grid item ={6}>
            <Controller
              name="datumRodjenja"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Datum rođenja"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date: Dayjs | null) => field.onChange(date?.toDate())}
                    maxDate={dayjs()}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid size={6}>
            <AppTextInput control={control} name="pol" label="Pol" />
          </Grid>
          <Grid size={12}>
            <AppTextInput control={control} name="adresa" label="Adresa" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="telefon" label="Telefon" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="maticniBroj" label="Matični broj" />
          </Grid>
        </Grid>
xs
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Button onClick={() => setEditMode(false)} variant="contained" color="inherit">
            Otkaži
          </Button>
          <Button loading={isSubmitting} variant="contained" color="success" type="submit">
            Sačuvaj
          </Button>
        </Box>
      </form>
    </Box>
  );
}*/
