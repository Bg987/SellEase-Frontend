import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/api";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    
    const token = location.state?.token;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOTP({ token, otp }); // Call API
            alert(response.data.message); // Show success message
            navigate("/login");
        } catch (error) {
            console.log("Error:", error);
            alert("Invalid OTP");
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
                        Enter OTP to Verify
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="OTP Code"
                            type="text"
                            variant="outlined"
                            fullWidth
                            required
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: "linear-gradient(90deg, #06B6D4, #0284C7)", // Cyan Gradient Button
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #0284C7, #06B6D4)",
                                },
                            }}
                        >
                            Verify OTP
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default VerifyOTP;
