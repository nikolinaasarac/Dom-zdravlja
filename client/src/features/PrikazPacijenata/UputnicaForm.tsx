import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import type { UputnicaDto } from "../../models/Uputnica";
import { useCreateUputnicaMutation } from "./pacijentApi";

export default function UputnicaForm() {
  const { id: pacijentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<UputnicaDto>({
    dijagnoza: "",
    opis: "",
    upucujeSe: "",
    doktorId: 1, // privremeno
  });

  const [createUputnica, { isLoading }] = useCreateUputnicaMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacijentId) return;

    try {
      await createUputnica({ pacijentId: Number(pacijentId), data: form }).unwrap();
      alert("Uputnica kreirana!");
      navigate(`/pacijenti/${pacijentId}/uputnice`); // vrati na listu uputnica
    } catch (err) {
      console.error(err);
      alert("Greška prilikom kreiranja uputnice");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Nova uputnica
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Dijagnoza"
          variant="outlined"
          fullWidth
          value={form.dijagnoza}
          onChange={(e) => setForm({ ...form, dijagnoza: e.target.value })}
          required
        />
        <TextField
          label="Opis"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={form.opis}
          onChange={(e) => setForm({ ...form, opis: e.target.value })}
          required
        />
        <TextField
          label="Upućuje se"
          variant="outlined"
          fullWidth
          value={form.upucujeSe}
          onChange={(e) => setForm({ ...form, upucujeSe: e.target.value })}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? "Šaljem..." : "Kreiraj uputnicu"}
        </Button>
      </Box>
    </Paper>
  );
}
