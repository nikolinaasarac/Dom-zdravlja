import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { setAccessToken } from "./tokenStore";
import { setUser, logout } from "./authSlice";
import { authApi } from "./authApi";
import type { JwtPayload } from "../../models/JwtPayload";
import { jwtDecode } from "jwt-decode";

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
      const response = await authApi.login({ username, password });
      const { accessToken, userId, mustChangePassword } = response.data;
      setAccessToken(accessToken);

      const decoded = jwtDecode<JwtPayload>(accessToken);

      if (userId) {
        dispatch(
          setUser({
            id: decoded.userId,
            email: "", 
            role: decoded.role,
          })
        );
      }

      if (mustChangePassword) {
        navigate("/promijeni-lozinku", { replace: true });
        return;
      }

      navigate("/homepage", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Neispravni podaci za prijavu.");
      dispatch(logout());
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        color: "#fff", 
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="../../../images/logo.png" 
          alt="Logo"
          sx={{ width: 200, height: 150, mb: 2 }}
        />

        <Typography
          variant="h4"
          sx={{ mb: 1, fontWeight: 600, letterSpacing: 1, color: "#fff" }}
        >
          Login
        </Typography>
        <Typography sx={{ mb: 3, color: "#fff", fontSize: 14 }}>
          Dobrodošli nazad! Prijavite se na svoj nalog.
        </Typography>

        <TextField
          label="Korisničko ime"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#90caf9" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
            "& .MuiInputLabel-root": { color: "#fff" },
          }}
        />
        <TextField
          label="Lozinka"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#90caf9" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
            "& .MuiInputLabel-root": { color: "#fff" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "12px",
            background: "linear-gradient(90deg, #43cea2, #185a9d)",
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
            fontSize: "1rem",
            "&:hover": {
              background: "linear-gradient(90deg, #3bb78f, #184e8d)",
            },
          }}
        >
          Prijavi se
        </Button>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
