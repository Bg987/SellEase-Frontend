import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    MenuItem,
    CardMedia,
    useMediaQuery,
    InputAdornment,
    IconButton,
    Skeleton
} from "@mui/material";
import { ArrowBack, Clear, Chat } from "@mui/icons-material";
import { BuyItem } from "../services/api";

const Buy = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    useEffect(() => {
        const cityName = localStorage.getItem("City");
        if (cityName) {
            setFilterCity(cityName);
        }
        const fetch = async () => {
            try {
                const response = await BuyItem();
                if (response.data.success) {
                    setHistory(response.data.items);
                    setFilteredHistory(response.data.items);
                } else {
                    setHistory([]);
                    setFilteredHistory([]);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                setHistory([]);
                setFilteredHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh", padding: 3, background: "#f9f9f9" }}>
            <Button variant="contained" startIcon={<ArrowBack />} sx={{ mb: 2 }} onClick={() => navigate("/messages")}>
                Messages
            </Button>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")} sx={{ mb: 2 }}>
                Back to Dashboard
            </Button>

            <Typography variant="h4" gutterBottom>
                Buy Second Hand Items
            </Typography>

            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <Skeleton variant="rectangular" width="100%" height={180} />
                                <CardContent>
                                    <Skeleton width="60%" />
                                    <Skeleton width="80%" />
                                    <Skeleton width="40%" />
                                    <Skeleton width="90%" />
                                    <Skeleton variant="rectangular" width="100%" height={36} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card>
                                {item.images?.length > 0 ? (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.images[0]}
                                        alt={item.itemName}
                                        loading="lazy"
                                        sx={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/default-placeholder.jpg"
                                        alt="No Image"
                                        loading="lazy"
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6"><b>{item.itemName}</b></Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Price:</b> ₹{item.sellPrice}</Typography>
                                    <Typography variant="body2"><b>City:</b> {item.city}</Typography>
                                    <Typography variant="body2"><b>Status:</b> {item.status}</Typography>
                                    <Typography variant="body2">
                                        <b>Uploaded:</b> {formatDistanceToNow(new Date(item.uploadDate), { addSuffix: true })}
                                    </Typography>
                                    <Typography variant="body2"><b>Description:</b> {item.description}</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Chat />}
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate(`/chat`, { state: { item } })}
                                    >
                                        Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="red" sx={{ mt: 2 }}>
                        {filterCity ? `No items for sale in ${filterCity}` : "No items for sale"}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Buy;
