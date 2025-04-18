import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api";
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        mobile: "",
        city: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Loading state

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // ✅ Show loader when request starts
        setMsg(""); // Clear previous messages

        try {
            const response = await signup(formData);
            navigate("/verify-otp", { state: { token: response.data.token } });
        } catch (error) {
            console.log(error);
            setMsg(error.response?.data.message || "Signup failed");
        } finally {
            setLoading(false); // ✅ Hide loader when request ends
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #1E3A8A, #3B82F6)", // Blue gradient background
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
                        Create Your Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField label="Username" name="username" variant="outlined" fullWidth required onChange={handleChange} />
                        <TextField label="Email(For OTP)" name="email" type="email" variant="outlined" fullWidth required onChange={handleChange} />
                        <TextField label="Password" name="password" type="password" variant="outlined" fullWidth required onChange={handleChange} />
                        <TextField label="Mobile" name="mobile" type = "number" variant="outlined" fullWidth required onChange={handleChange} />
                        <TextField label="City" name="city" variant="outlined" fullWidth required onChange={handleChange} />
                        
                        {/* Show Loading Spinner Instead of Button Text */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading} // Disable button while loading
                            sx={{
                                background: "linear-gradient(90deg, #06B6D4, #0284C7)", // Cyan Gradient Button
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #0284C7, #06B6D4)",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Generate OTP"}
                        </Button>
                    </Box>

                    {/* Error Message */}
                    {msg && (
                        <Typography align="center" sx={{ color: "red", marginTop: 2 }}>
                            {msg}
                        </Typography>
                    )}

                    {/* Login Link */}
                    <Typography align="center" sx={{ marginTop: 2, color: "#1E40AF" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#0284C7", textDecoration: "none", fontWeight: "bold" }}>
                            Login here
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;
