import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useGlobalState } from './GS';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [msg, setmsg] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const { dologin } = useGlobalState();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading animation
        try {
            const res = await login(credentials);
            const Uname = res.data.Uname;
            const city = res.data.city;
            const Id = res.data.userId;
            localStorage.setItem("Uname", Uname);
            localStorage.setItem("City", city);
            localStorage.setItem("userId", Id);
            dologin();
            navigate("/");
        } catch (error) {
            setmsg(error.response?.data.message || "Login failed");
        } finally {
            setLoading(false); // Stop loading animation
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
                        Glad To See You Again
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField label="Email" name="email" type="email" variant="outlined" fullWidth required onChange={handleChange} />
                        <TextField label="Password" name="password" type="password" variant="outlined" fullWidth required onChange={handleChange} />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading} // Disable button when loading
                            sx={{
                                background: "linear-gradient(90deg, #06B6D4, #0284C7)", 
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #0284C7, #06B6D4)",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                        </Button>
                    </Box>

                    <Typography align="center" sx={{ marginTop: 2, color: "#1E40AF" }}>
                        New User?{" "}
                        <Link to="/signup" style={{ color: "#0284C7", textDecoration: "none", fontWeight: "bold" }}>
                            Signup Here
                        </Link><br/>Forgot Password?
                        <Link to="/forgot" style={{ color: "#0284C7", textDecoration: "none", fontWeight: "bold" }}>
                            Click here
                        </Link>
                    </Typography>

                    {msg && (
                        <Typography align="center" sx={{ color: "red", marginTop: 2 }}>
                            {msg}
                        </Typography>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
