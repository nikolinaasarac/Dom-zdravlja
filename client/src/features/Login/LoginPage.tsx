import { useState } from "react";
import { setTokens, setUserId } from "./authSlice";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { authApi } from "./authApi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ username, password });
      const { accessToken, refreshToken, userId } = response.data; // <-- izdvajamo userId

    dispatch(setTokens({ accessToken, refreshToken }));
    
    if (userId) {
      dispatch(setUserId(userId));
    }


      // Ako je login uspješan, preusmjeri na početnu stranu
      navigate("/homepage", { replace: true });
    } catch {
      setError("Invalid credentials");
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
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Login
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
