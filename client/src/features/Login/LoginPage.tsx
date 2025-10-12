import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { setAccessToken } from "./tokenStore"; // tokenStore runtime memorija
import { setUser, logout } from "./authSlice"; // ako koristiš user info u Reduxu
import { authApi } from "./authApi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Login request
      const response = await authApi.login({ username, password });

      // Backend vraća TokenResponseDto
      const { accessToken, userId } = response.data;
      console.log(accessToken);

      // 🔹 Sačuvaj samo access token (u runtime memoriji)
      setAccessToken(accessToken);

      // 🔹 (Opcionalno) sačuvaj user info u Redux ako želiš prikazati username itd.
      if (userId) {
        dispatch(setUser({
          id: userId,
          email: "",
          role: ""
        }));
      }

      // 🔹 Navigacija poslije uspješnog logina
      navigate("/homepage", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Neispravni podaci za prijavu.");
      dispatch(logout());
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={3}>
        Login
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        display="flex"
        flexDirection="column"
        gap={2}
        width={300}
      >
        <TextField
          label="Korisničko ime"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Lozinka"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Prijavi se
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
