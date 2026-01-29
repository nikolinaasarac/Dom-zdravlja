import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createZahtjevSchema,
  type CreateZahtjevSchema,
} from "../../lib/schemas/createZahtjevSchema";
import AppSelect from "../../components/AppSelect";
import AppTextInput from "../../components/AppTextInput";
import { useCreateZahtjevMutation } from "../doktor/doktorApi";
import { useFetchDoktoriQuery } from "../PrikazPacijenata/pacijentApi";

type Props = {
  onSuccess?: () => void;
};

export default function ZahtjevForm({ onSuccess }: Props) {
  const { data: doktori, isLoading: doktoriLoading } = useFetchDoktoriQuery();
  const [createZahtjev, { isLoading }] = useCreateZahtjevMutation();

  const { control, handleSubmit, reset } = useForm<CreateZahtjevSchema>({
    resolver: zodResolver(createZahtjevSchema),
    defaultValues: {
      doktorId: "", 
      opis: "",
    },
  });

  const onSubmit = async (data: CreateZahtjevSchema) => {
    try {
      await createZahtjev({ ...data, doktorId: data.doktorId }).unwrap();
      reset();
      if (onSuccess) onSuccess();
      alert("Zahtjev uspješno poslan!");
    } catch (error) {
      console.error("Greška pri kreiranju zahtjeva:", error);
      alert("Greška prilikom slanja zahtjeva.");
    }
  };

  if (doktoriLoading) return <Typography>Učitavanje doktora...</Typography>;

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "md", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Kreiraj novi zahtjev
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppSelect
              name="doktorId"
              control={control} 
              label="Izaberite doktora"
              options={
                doktori?.map((d) => ({
                  value: d.id.toString(),
                  label: `${d.ime} ${d.prezime} (${d.specijalizacija})`,
                })) || []
              }
            />
          </Grid>

          <Grid size={12}>
            <AppTextInput
              name="opis"
              control={control} 
              label="Opis zahtjeva"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            Pošalji zahtjev
          </Button>
        </Box>
      </form>
    </Box>
  );
}
