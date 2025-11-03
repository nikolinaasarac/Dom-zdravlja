import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  TextField,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useGetMyAccountQuery, useUpdateUsernameMutation } from "./korisnikApi";
import React from "react";

export default function MojNalog() {
  const labels: Record<string, string> = {
    username: "Korisničko ime",
    role: "Uloga",
    ime: "Ime",
    prezime: "Prezime",
    specijalizacija: "Specijalizacija",
    brojLicence: "Broj licence",
    telefon: "Telefon",
    email: "Email",
    adresa: "Adresa",
    jmbg: "JMBG",
    datumRodjenja: "Datum rođenja",
    maticniBroj: "Matični broj",
  };

  const { data, isLoading, error } = useGetMyAccountQuery();

  const [updateUsername] = useUpdateUsernameMutation();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={5}>
        Greška pri učitavanju podataka.
      </Typography>
    );

  if (!data)
    return (
      <Typography align="center" mt={5}>
        Nema dostupnih podataka.
      </Typography>
    );

  const ime =
    data.doktor?.ime ||
    data.pacijent?.ime ||
    data.tehnicar?.ime || "";
  const prezime = data.doktor?.prezime || data.pacijent?.prezime || data.tehnicar?.prezime || "";
  const role = data.role;

  const handleSave = async () => {
    try {
      await updateUsername({ username }).unwrap();
      setEditMode(false);
    } catch {
      alert("Greška pri ažuriranju naloga.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 500,
          borderRadius: 5,
          backdropFilter: "blur(12px)",
          color: "white",
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(63,81,181,0.9), rgba(156,39,176,0.8))",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            bgcolor: "primary.main",
            fontSize: 36,
          }}
        >
          {ime.charAt(0)}
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {ime} {prezime}
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          {role}
        </Typography>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.3)", mb: 3 }} />

        <Box mt={3}>
          <Grid container spacing={1} textAlign="left">
            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                Korisničko ime:
              </Typography>
            </Grid>
            <Grid size={6}>
              {editMode ? (
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ background: "white", borderRadius: 1 }}
                />
              ) : (
                <Typography variant="subtitle1">{data.username}</Typography>
              )}
            </Grid>

            {data.doktor &&
              Object.entries(data.doktor).map(([key, value]) => {
                if (value === null || value === undefined) return null;
                return (
                  <React.Fragment key={key}>
                    <Grid size={6}>
                      <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        {labels[key] || key}:
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="subtitle1">{value}</Typography>
                    </Grid>
                  </React.Fragment>
                );
              })}

            {/* Polja pacijenta */}
            {data.pacijent &&
              Object.entries(data.pacijent).map(([key, value]) => {
                if (value === null || value === undefined) return null;
                return (
                  <React.Fragment key={key}>
                    <Grid size={6}>
                      <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        {labels[key] || key}:
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="subtitle1">{value}</Typography>
                    </Grid>
                  </React.Fragment>
                );
              })}

            {/* Polja tehničara */}
            {data.tehnicar &&
              Object.entries(data.tehnicar).map(([key, value]) => {
                if (value === null || value === undefined) return null;

                return (
                  <React.Fragment key={key}>
                    <Grid size={6}>
                      <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        {labels[key] || key}:
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="subtitle1">{value}</Typography>
                    </Grid>
                  </React.Fragment>
                );
              })}

            <Grid size={6}>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                Uloga:
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1">{data.role}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="success"
                //disabled={isSaving}
                onClick={handleSave}
              >
                Sačuvaj
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setEditMode(false)}
              >
                Odustani
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setUsername(data.username);
                setEditMode(true);
              }}
            >
              Uredi nalog
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
