import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppTextInput from "../../components/AppTextInput";
import type { Pregled } from "../../models/Pregled";
import { createPregledInfoSchema, type CreatePregledInfoSchema } from "../../lib/schemas/createPregledSchema";
import { useCreatePregledInfoMutation } from "./doktorApi";
import { useEffect } from "react";


type Props = {
    pregled: Pregled;
    setEditMode: (value: boolean) => void;
    refetch: () => void;
};

export default function PregledForm({
    pregled,
    setEditMode,
    refetch
}: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreatePregledInfoSchema>({
        mode: "onTouched",
        resolver: zodResolver(createPregledInfoSchema),
        defaultValues: {
            dijagnoza: "",
            terapija: "",
            napomena: "",
        },
    });

    const [createPregledInfo] = useCreatePregledInfoMutation();

    // Ako je forma za editovanje postojećeg pregleda
    useEffect(() => {
        if (pregled) {
            reset({
                dijagnoza: pregled.dijagnoza ?? "",
                terapija: pregled.terapija ?? "",
                napomena: pregled.napomena ?? "",
            });
        }
    }, [pregled, reset]);

    const onSubmit = async (data: CreatePregledInfoSchema) => {
        console.log("Forma šalje:", data);
        console.log("Pregled ID:", pregled.id);
        try {
            if (pregled && pregled.id) {
                await createPregledInfo({ id: pregled.id, data }).unwrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEditMode(false); // ✅ sigurno zatvori dijalog
            await refetch();    // ✅ sigurno osvježi tabelu
        }
    };


    return (
        <Box component={Paper} sx={{ p: 4, maxWidth: "md", mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                {pregled ? "Uredi pregled" : "Unesi detalje pregleda"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <AppTextInput control={control} name="dijagnoza" label="Dijagnoza" />
                    </Grid>
                    <Grid size={12}>
                        <AppTextInput control={control} name="terapija" label="Terapija" />
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
                        variant="contained"
                        color="success"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Sačuvaj
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
