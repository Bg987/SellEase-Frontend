import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Box, Typography, Container, Card, CardContent, Grid, Badge } from "@mui/material";
import { ChatBubbleOutline, ShoppingCart, Sell, History, Logout, Home, Mail } from "@mui/icons-material";
import { useGlobalState } from "./GS";
import { logout, unreadMessage } from "../services/api";

const Dashboard = () => {
    const { isLoggedIn, dologout } = useGlobalState();
    const navigate = useNavigate();
    const [Uname, setUname] = useState(localStorage.getItem('Uname') || "Unauthorized user");
    const [d, setD] = useState(localStorage.getItem('Uname') ? 'Buy or sell second-hand items effortlessly on SellEase' : "You Cannot Do anything");
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const response = await unreadMessage();
                setUnreadCount(response.data.unreadCount); // Assuming API returns { count: number }
            } catch (error) {
                console.error("Error fetching unread messages:", error);
            }
        };

        fetchUnreadMessages();
    }, []);

    const handleLogout = async () => {
        await logout();
        dologout();
        navigate("/");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ece9e6, #ffffff)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Navbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#1976d2",
                    color: "white",
                    padding: "10px 20px",
                }}
            >
                <Typography variant="h6">SellEase Dashboard</Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Unread Messages Icon */}
                    <IconButton
                        sx={{
                            backgroundColor: "#ffffff",
                            padding: "10px",
                            borderRadius: "50%",
                            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                            transition: "0.3s",
                            "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                        onClick={() => navigate("/messages")} // Navigate to Messages Page
                    >
                        <Badge badgeContent={unreadCount >= 0 ? unreadCount : null} color="error">
                            <ChatBubbleOutline sx={{ fontSize: 28, color: "#1976d2" }} />
                        </Badge>
                    </IconButton>


                    {/* Logout Button */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
                {/* Welcome Card */}
                <Card sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Welcome, {Uname}! 🎉
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {d}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={3}>
                        <Card
                            onClick={() => navigate("/")}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 5 },
                            }}
                        >
                            <Home sx={{ fontSize: 50, color: "#4caf50" }} />
                            <Typography variant="h5">Home</Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Card
                            onClick={() => navigate("/sell")}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 5 },
                            }}
                        >
                            <Sell sx={{ fontSize: 50, color: "#0288d1" }} />
                            <Typography variant="h5">Sell Items</Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Card
                            onClick={() => navigate("/buy")}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 5 },
                            }}
                        >
                            <ShoppingCart sx={{ fontSize: 50, color: "#d32f2f" }} />
                            <Typography variant="h5">Buy Items</Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Card
                            onClick={() => navigate("/history")}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 5 },
                            }}
                        >
                            <History sx={{ fontSize: 50, color: "#ff9800" }} />
                            <Typography variant="h5">History</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
