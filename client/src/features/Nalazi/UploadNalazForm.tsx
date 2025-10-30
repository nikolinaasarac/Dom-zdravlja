import { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import type { ZahtjevZaAnalizu } from "../../models/ZahtjevZaAnalizu";
import { useZavrsiObraduMutation } from "./zahtjevApi";

export default function UploadNalazForm({
  zahtjev,
  onSuccess,
}: {
  zahtjev: ZahtjevZaAnalizu;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [zavrsiObradu, { isLoading }] = useZavrsiObraduMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadError("Molimo odaberite PDF fajl.");
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadError("Samo PDF fajl je dozvoljen.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await zavrsiObradu({ zahtjevId: zahtjev.id, formData }).unwrap();

      onSuccess();
    } catch (err) {
      console.error(err);
      setUploadError("Došlo je do greške pri uploadu fajla.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Typography>
        Upload PDF nalaza za zahtjev <b>{zahtjev.opis}</b>
      </Typography>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {uploadError && <Typography color="error">{uploadError}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ alignSelf: "flex-end" }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Završi zahtjev"}
      </Button>
    </Box>
  );
}
