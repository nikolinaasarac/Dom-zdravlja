import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import {
  useFetchKrvnaGrupaQuery,
  useCreateKrvnaGrupaMutation,
  useUpdateKrvnaGrupaMutation,
} from "./pacijentApi";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createKrvnaGrupaSchema,
  type CreateKrvnaGrupaSchema,
} from "../../lib/schemas/createKrvnaGrupaSchema";

export type Props = {
  pacijentId: number;
};

export default function KrvnaGrupaPrikaz({ pacijentId }: Props) {
  const {
    data: krvnaGrupa,
    error,
    isLoading,
    refetch,
  } = useFetchKrvnaGrupaQuery(pacijentId);

  const [openForm, setOpenForm] = useState(false);
  const [createKrvnaGrupa] = useCreateKrvnaGrupaMutation();
  const [updateKrvnaGrupa] = useUpdateKrvnaGrupaMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateKrvnaGrupaSchema>({
    mode: "onTouched",
    resolver: zodResolver(createKrvnaGrupaSchema),
    defaultValues: {
      grupa: "",
      faktor: "",
    },
  });

  useEffect(() => {
    if (krvnaGrupa) {
      reset({
        grupa: krvnaGrupa.grupa,
        faktor: krvnaGrupa.faktor,
      });
    }
  }, [krvnaGrupa, reset]);

  const onSubmit = async (data: CreateKrvnaGrupaSchema) => {
    try {
      if (krvnaGrupa) {
        await updateKrvnaGrupa({ pacijentId, data }).unwrap();
      } else {
        await createKrvnaGrupa({ pacijentId, data }).unwrap();
      }
      setOpenForm(false);

      refetch();
    } catch (err) {
      console.error("Greška prilikom čuvanja krvne grupe:", err);
    }
  };

  const openEditForm = () => {
    if (krvnaGrupa) {
      reset({
        grupa: krvnaGrupa.grupa,
        faktor: krvnaGrupa.faktor,
      });
    }
    setOpenForm(true);
  };

  return (
    <Card
      sx={{ mt: 3, borderRadius: 2, boxShadow: 2, border: "1px solid #e0e0e0" }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}
        >
          Krvna grupa pacijenta
        </Typography>

        {isLoading && (
          <Typography variant="body2" color="text.secondary">
            Učitavanje krvne grupe...
          </Typography>
        )}
        {!isLoading && !error && !krvnaGrupa && (
          <Typography variant="body2" color="text.secondary">
            Pacijent nema evidentiranu krvnu grupu.
          </Typography>
        )}
        {!isLoading && krvnaGrupa && (
          <Box>
            <Typography variant="body2">
              <strong>Grupa:</strong> {krvnaGrupa.grupa}
            </Typography>
            <Typography variant="body2">
              <strong>Faktor:</strong> {krvnaGrupa.faktor}
            </Typography>
          </Box>
        )}

        <Button sx={{ mt: 2 }} variant="contained" onClick={openEditForm}>
          {krvnaGrupa ? "Uredi krvnu grupu" : "Unesi krvnu grupu"}
        </Button>

        {openForm && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="grupa"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Grupa"
                  error={!!errors.grupa}
                  helperText={errors.grupa?.message}
                />
              )}
            />
            <Controller
              name="faktor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Faktor"
                  error={!!errors.faktor}
                  helperText={errors.faktor?.message}
                />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              Sačuvaj
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenForm(false)}
            >
              Otkaži
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
