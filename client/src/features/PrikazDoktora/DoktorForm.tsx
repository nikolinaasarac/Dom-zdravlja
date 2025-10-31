import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppTextInput from "../../components/AppTextInput";
import {
  createDoktorSchema,
  type CreateDoktorSchema,
} from "../../lib/schemas/createDoktorSchema";
import type { Doktor } from "../../models/Doktor";
import {
  useCreateDoktorMutation,
  useUpdateDoktorMutation,
} from "../admin/adminApi";

type Props = {
  setEditMode: (value: boolean) => void;
  doktor: Doktor | null;
  refetch: () => void;
  setSelectedDoktor: (value: Doktor | null) => void;
};

export default function DoktorForm({
  setEditMode,
  doktor,
  refetch,
  setSelectedDoktor,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateDoktorSchema>({
    mode: "onTouched",
    resolver: zodResolver(createDoktorSchema),
    defaultValues: {
      ime: "",
      prezime: "",
      maticniBroj: "",
      specijalizacija: "",
      brojLicence: "",
      telefon: "",
      email: "",
      adresa: "",
    },
  });

  const [createDoktor] = useCreateDoktorMutation();
  const [updateDoktor] = useUpdateDoktorMutation();

  useEffect(() => {
    if (doktor) {
      reset({
        ...doktor,
      });
    }
  }, [doktor, reset]);

  const onSubmit = async (data: CreateDoktorSchema) => {
    try {
      if (doktor && doktor.id !== undefined) {
        await updateDoktor({ id: doktor.id, data }).unwrap();
      } else {
        await createDoktor(data).unwrap();
      }

      setEditMode(false);
      setSelectedDoktor(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "md", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {doktor ? "Uredi doktora" : "Dodaj novog doktora"}
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
            <AppTextInput
              control={control}
              name="maticniBroj"
              label="Matični broj"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput
              control={control}
              name="specijalizacija"
              label="Specijalizacija"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput
              control={control}
              name="brojLicence"
              label="Broj licence"
            />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="telefon" label="Telefon" />
          </Grid>
          <Grid size={6}>
            <AppTextInput control={control} name="email" label="Email" />
          </Grid>
          <Grid size={12}>
            <AppTextInput control={control} name="adresa" label="Adresa" />
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
            color="success"
            type="submit"
          >
            Sačuvaj
          </Button>
        </Box>
      </form>
    </Box>
  );
}
