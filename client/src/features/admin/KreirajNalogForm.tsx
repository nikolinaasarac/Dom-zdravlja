import { Box, Button, MenuItem, Stack, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppTextInput from "../../components/AppTextInput";
import { useCreateKorisnikMutation } from "./adminApi";
import {
  createKorisnikSchema,
  type CreateKorisnikSchema,
} from "../../lib/schemas/createKorisnikSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KreirajNalogForm() {
  const [createKorisnik, { isLoading }] = useCreateKorisnikMutation();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const { handleSubmit, control, watch, reset } = useForm<CreateKorisnikSchema>(
    {
      resolver: zodResolver(createKorisnikSchema),
      defaultValues: {
        username: "",
        password: "",
        role: "Admin",
        maticniBroj: "",
      },
    }
  );

  const role = watch("role");

  const onSubmit = async (data: CreateKorisnikSchema) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const result = await createKorisnik(data).unwrap();
      setSuccessMsg(`Korisnik "${result.username}" uspješno kreiran!`);
      reset();
      setTimeout(() => {
        navigate("/nalozi"); 
      }, 1500);
    } catch (err) {
      const message =
        (err as { data?: string })?.data ||
        "Došlo je do greške pri kreiranju korisnika.";
      setErrorMsg(message);
    }
  };

  return (
    <Box
      maxWidth={500}
      mx="auto"
      mt={4}
      p={4}
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow: 3,
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" mb={2}>
        Kreiraj korisnički nalog
      </Typography>

      <Stack spacing={2}>
        <AppTextInput<CreateKorisnikSchema>
          name="username"
          label="Korisničko ime"
          control={control}
        />
        <AppTextInput<CreateKorisnikSchema>
          name="password"
          label="Lozinka"
          type="password"
          control={control}
        />
        <AppTextInput<CreateKorisnikSchema>
          name="role"
          label="Uloga"
          select
          control={control}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Doktor">Doktor</MenuItem>
          <MenuItem value="Pacijent">Pacijent</MenuItem>
          <MenuItem value="Tehnicar">Tehničar</MenuItem>
        </AppTextInput>

        {role !== "Admin" && (
          <AppTextInput<CreateKorisnikSchema>
            name="maticniBroj"
            label="Matični broj"
            control={control}
          />
        )}

        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Kreiranje..." : "Kreiraj nalog"}
        </Button>
      </Stack>
    </Box>
  );
}
