import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppTextInput from "../../components/AppTextInput";

import type { Tehnicar } from "../../models/Tehnicar";
import {
  createTehnicarSchema,
  type CreateTehnicarSchema,
} from "../../lib/schemas/createTehnicarSchema";
import {
  useCreateTehnicarMutation,
  useUpdateTehnicarMutation,
} from "../admin/adminApi";

type Props = {
  setEditMode: (value: boolean) => void;
  tehnicar: Tehnicar | null;
  refetch: () => void;
  setSelectedTehnicar: (value: Tehnicar | null) => void;
};

export default function TehnicarForm({
  setEditMode,
  tehnicar,
  refetch,
  setSelectedTehnicar,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTehnicarSchema>({
    mode: "onTouched",
    resolver: zodResolver(createTehnicarSchema),
    defaultValues: {
      ime: "",
      prezime: "",
      maticniBroj: "",
      telefon: "",
      email: "",
      adresa: "",
    },
  });

  const [createTehnicar] = useCreateTehnicarMutation();
  const [updateTehnicar] = useUpdateTehnicarMutation();

  useEffect(() => {
    if (tehnicar) {
      reset({
        ...tehnicar,
      });
    }
  }, [tehnicar, reset]);

  const onSubmit = async (data: CreateTehnicarSchema) => {
    try {
      if (tehnicar && tehnicar.id !== undefined) {
        await updateTehnicar({ id: tehnicar.id, data }).unwrap();
      } else {
        await createTehnicar(data).unwrap();
      }

      setEditMode(false);
      setSelectedTehnicar(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "md", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {tehnicar ? "Uredi tehničara" : "Dodaj novog tehničara"}
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
