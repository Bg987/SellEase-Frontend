import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { forgotPass } from "../services/api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await forgotPass(email);
      console.log(res);
      setMsg(res.data.message);
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "white",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#1E40AF", marginBottom: 2 }}>
            Forgot Password?
          </Typography>
          <Typography align="center" sx={{ marginBottom: 3 }}>
            Enter your registered email. Your password will be sent via email.
          </Typography>

          {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg, #06B6D4, #0284C7)",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(90deg, #0284C7, #06B6D4)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Password"}
            </Button>
          </Box>

          <Typography align="center" sx={{ marginTop: 2, color: "#1E40AF" }}>
            Back to{" "}
            <Link to="/login" style={{ color: "#0284C7", fontWeight: "bold", textDecoration: "none" }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
