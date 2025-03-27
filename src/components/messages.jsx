import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, Box, Typography, Divider, Button, CircularProgress } from "@mui/material";
import { ArrowBack, FiberManualRecord } from "@mui/icons-material"; // FiberManualRecord for blinking effect
import { getChatUsers } from "../services/api"; // API call to fetch chat users

const Messages = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getChatUsers();
                const { users: userList } = response.data;

                const storedNames = JSON.parse(localStorage.getItem("sellerNames")) || {};

                const formattedUsers = userList.map(({ userId, hasUnreadMessages }) => ({
                    userId,
                    username: storedNames[userId] || `User ${userId}`,
                    hasUnreadMessages,
                }));

                setUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching chat users:", error);
                setError("Failed to load messages.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    
    const handliclick = (id) => {
        let item = [];//beacause of buy componenet
        item.userId = id
        navigate("/chat", { state: { item } })
    }

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: "16px" }}>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")}>
                Back
            </Button>
            <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>
                Messages
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" textAlign="center">
                    {error}
                </Typography>
            ) : users.length === 0 ? (
                <Typography textAlign="center" color="textSecondary">
                    No messages yet.
                </Typography>
            ) : (
                <List>
                    {users.map(({ userId, username, hasUnreadMessages }) => (
                        <Box key={userId}>
                            <ListItem button onClick={() => handliclick(userId)}>
                                <ListItemText primary={username} secondary="Tap to chat" />
                                {hasUnreadMessages && (
                                    <FiberManualRecord
                                        sx={{
                                            color: "red",
                                            fontSize: 12,
                                            ml: 2,
                                            animation: "blink 1s infinite",
                                        }}
                                    />
                                )}
                            </ListItem>
                            <Divider />
                        </Box>
                    ))}
                </List>
            )}

            {/* Blinking animation style */}
            <style>
                {`
                    @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        </Box>
    );
};

export default Messages;
