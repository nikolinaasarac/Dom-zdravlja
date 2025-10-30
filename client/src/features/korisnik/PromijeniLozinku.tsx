import { Box, Button, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  usePromijeniLozinkuAdminMutation,
  usePromijeniLozinkuMutation,
} from "./korisnikApi";
import AppTextInput from "../../components/AppTextInput";
import { logout } from "../Login/authSlice";
import {
  promjenaLozinkeSchema,
  type PromjenaLozinkeForm,
} from "../../lib/schemas/createPromjenaLozinkeSchema";

type Props = {
  userId?: string; // opcionalno, samo za admina
};

export default function PromijeniLozinku({ userId }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [promijeniLozinku] = usePromijeniLozinkuMutation();
  const [promijeniLozinkuAdmin] = usePromijeniLozinkuAdminMutation();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<PromjenaLozinkeForm>({
    resolver: zodResolver(promjenaLozinkeSchema),
  });

  const onSubmit = async (data: PromjenaLozinkeForm) => {
    try {
      if (userId) {
        // admin mijenja lozinku nekome
        await promijeniLozinkuAdmin({
          userId,
          novaLozinka: data.novaLozinka,
          potvrdiLozinku: data.potvrdiLozinku,
        }).unwrap();
      } else {
        await promijeniLozinku({
          novaLozinka: data.novaLozinka,
          potvrdiLozinku: data.potvrdiLozinku,
        }).unwrap();
      }

      dispatch(logout());
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Greška pri promjeni lozinke:", err);
    }
  };

  return (
    <Paper
      elevation={3} // senka
      sx={{
        maxWidth: 400,
        margin: "auto",
        p: 4, // unutrašnji padding
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 400,
          margin: "auto",
          mt: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center">
          Promjena lozinke
        </Typography>

        <AppTextInput<PromjenaLozinkeForm>
          label="Nova lozinka"
          type="password"
          name="novaLozinka"
          control={control}
        />

        <AppTextInput<PromjenaLozinkeForm>
          label="Potvrdi novu lozinku"
          type="password"
          name="potvrdiLozinku"
          control={control}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          Promijeni lozinku
        </Button>
      </Box>
    </Paper>
  );
}
