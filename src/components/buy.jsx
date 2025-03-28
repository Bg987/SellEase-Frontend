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

    useEffect(() => {
        let filtered = history;

        if (search) {
            filtered = filtered.filter(item => item.itemName.toLowerCase().includes(search.toLowerCase()));
        }
        if (filterCategory) {
            filtered = filtered.filter(item => item.category === filterCategory);
        }
        if (filterCity) {
            filtered = filtered.filter(item => item.city === filterCity);
        }
        if (filterStatus) {
            filtered = filtered.filter(item => item.status === filterStatus);
        }
        if (sortOrder === "price-asc") {
            filtered = [...filtered].sort((a, b) => a.sellPrice - b.sellPrice);
        } else if (sortOrder === "price-desc") {
            filtered = [...filtered].sort((a, b) => b.sellPrice - a.sellPrice);
        }

        setFilteredHistory(filtered);
    }, [search, filterCategory, filterCity, filterStatus, sortOrder, history]);

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

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Search"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            endAdornment: search && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearch("")}>
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select label="Category" fullWidth value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Automobiles">Automobiles</MenuItem>
                        <MenuItem value="Home Appliances">Home Appliances</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select label="City" fullWidth value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                        <MenuItem value="Surat">Surat</MenuItem>
                        <MenuItem value="Rajkot">Rajkot</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select label="Status" fullWidth value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Sold">Sold</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" width="100%" height={180} />
                            <CardContent>
                                <Skeleton width="60%" />
                            </CardContent>
                        </Grid>
                    ))
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card>
                                <CardMedia component="img" height="180" image={item.images?.[0] || "/default-placeholder.jpg"} alt={item.itemName} />
                                <CardContent>
                                    <Typography variant="h6">{item.itemName}</Typography>
                                    <Typography variant="body2">₹{item.sellPrice}</Typography>
                                    <Button variant="contained" startIcon={<Chat />} onClick={() => navigate(`/chat`, { state: { item } })}>
                                        Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="red">No items found</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Buy;
