import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import type { ReceptDto } from "../../models/Recept";
import { useCreateReceptiMutation } from "../PrikazPacijenata/pacijentApi";

export default function ReceptForm() {
  const { id: pacijentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ReceptDto>({
    nazivLijeka: "",
    kolicina: "",
    nacinUzimanja: "",
    napomena: "",
  });

  const [createRecept, { isLoading }] = useCreateReceptiMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacijentId) return;

    try {
      await createRecept({ pacijentId: Number(pacijentId), data: form }).unwrap();
      alert("Recept uspješno kreiran!");
      navigate(`/pacijenti/${pacijentId}/recepti`);
    } catch (err) {
      console.error(err);
      alert("Greška prilikom kreiranja recepta");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Novi recept
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Naziv lijeka"
          variant="outlined"
          fullWidth
          value={form.nazivLijeka}
          onChange={(e) => setForm({ ...form, nazivLijeka: e.target.value })}
          required
        />
        <TextField
          label="Količina"
          variant="outlined"
          fullWidth
          value={form.kolicina}
          onChange={(e) => setForm({ ...form, kolicina: e.target.value })}
          required
        />
        <TextField
          label="Način uzimanja"
          variant="outlined"
          fullWidth
          multiline
          minRows={2}
          value={form.nacinUzimanja}
          onChange={(e) => setForm({ ...form, nacinUzimanja: e.target.value })}
          required
        />
        <TextField
          label="Napomena (opcionalno)"
          variant="outlined"
          fullWidth
          multiline
          minRows={2}
          value={form.napomena}
          onChange={(e) => setForm({ ...form, napomena: e.target.value })}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? "Šaljem..." : "Kreiraj recept"}
        </Button>
      </Box>
    </Paper>
  );
}
